# This script patches chess.html to use puzzles.json
# Run it locally: python3 patch_chess.py chess.html

import sys, re

with open(sys.argv[1], 'r') as f:
    src = f.read()

# ── 1. Add puzzles.json loader variable near the top of the script ──────────
# Find the puzzle state section and add our loader
old_puzzle_state = '''  let puzzleDifficulty = 'medium';
  let puzzleData = null, puzzleMoves = [], puzzleMoveIdx = 0, puzzleColor = 'white', puzzleSolved = false;
  let puzzleLevel = 1;
  let puzzleFirstTry = true;'''

new_puzzle_state = '''  let puzzleDifficulty = 'medium';
  let puzzleData = null, puzzleMoves = [], puzzleMoveIdx = 0, puzzleColor = 'white', puzzleSolved = false;
  let puzzleLevel = 1;
  let puzzleFirstTry = true;

  // ── PUZZLE BANK (loaded from puzzles.json) ──
  let PUZZLE_BANK = null; // { easy: [...], medium: [...], hard: [...], grandmaster: [...] }
  async function loadPuzzleBank() {
    if (PUZZLE_BANK) return PUZZLE_BANK;
    try {
      const r = await fetch('puzzles.json');
      PUZZLE_BANK = await r.json();
      console.log('[puzzles] loaded bank:', Object.entries(PUZZLE_BANK).map(([k,v])=>k+':'+v.length).join(', '));
    } catch(e) {
      console.warn('[puzzles] failed to load puzzles.json, using fallback:', e.message);
      PUZZLE_BANK = null;
    }
    return PUZZLE_BANK;
  }

  function getPuzzleForLevel(diff, level) {
    const pool = PUZZLE_BANK?.[diff];
    if (!pool || !pool.length) return null;
    // Level 1-1000 maps deterministically to puzzle index
    const idx = (level - 1) % pool.length;
    const p = pool[idx];
    return {
      puzzle: { id: p.id || (diff+'_'+idx), solution: p.moves, rating: p.rating, initialPly: 0, noSetup: true },
      game: { pgn: '', fen: p.fen }
    };
  }'''

src = src.replace(old_puzzle_state, new_puzzle_state)

# ── 2. Replace startPuzzle to use puzzles.json ───────────────────────────────
# Find the candidate loading block inside startPuzzle and replace it
old_candidate = '''    const diff = PUZZLE_DIFFICULTIES[puzzleDifficulty];
    let data = null;
    const MAX_ATTEMPTS = 10;

    for (let attempt=0; attempt<MAX_ATTEMPTS && !data; attempt++) {
      let candidate = null;
      try {
        if (!puzzleOfflineMode) {
        try {
          // Check if we already have a cached puzzle for this specific level
          const levelKey = 'wg_lvl_' + puzzleDifficulty + '_' + puzzleLevel;
          const cached = localStorage.getItem(levelKey);
          if (cached) {
            candidate = JSON.parse(cached);
          } else {
            candidate = await getPuzzleFromCacheOrFetch(puzzleDifficulty);
            if (candidate) localStorage.setItem(levelKey, JSON.stringify(candidate));
          }
        } catch(e) {}
      }
      } catch(e) { console.warn('[puzzle] fetch attempt',attempt,'failed:',e.message); }

      if (!candidate) {
        // Each level maps to a FIXED puzzle — same puzzle every time for that level
        const pool = OFFLINE_PUZZLES.filter(p=>p.rating>=diff.min&&p.rating<diff.max);
        const bank = pool.length ? pool : OFFLINE_PUZZLES;
        // Level is 1-based; wrap around if more levels than puzzles
        const idx = (puzzleLevel - 1) % bank.length;
        const bp = bank[idx];
        candidate = {
          puzzle:{id:bp.id,solution:bp.moves,rating:bp.rating,initialPly:0,noSetup:true},
          game:{pgn:'',fen:bp.fen}
        };
      }

      const err = validatePuzzleData(candidate);
      if (err) {
        console.warn('[puzzle] invalid (attempt '+attempt+'):',err,'id:',candidate?.puzzle?.id);
        if (candidate?.puzzle?.id) markPuzzleSeen(candidate.puzzle.id);
      } else {
        data = candidate;
      }
    }

    if (!data) {
      ol.style.display = 'none';
      updatePuzzleUI('error', 'Could not load a valid puzzle. Try downloading puzzles first.');
      return;
    }

    if (!puzzleOfflineMode) setTimeout(() => fillPuzzleCache(puzzleDifficulty), 3000);'''

new_candidate = '''    const diff = PUZZLE_DIFFICULTIES[puzzleDifficulty];
    let data = null;

    // Load puzzle bank if not already loaded
    await loadPuzzleBank();

    // Get puzzle for this specific level (always the same puzzle for same level)
    data = getPuzzleForLevel(puzzleDifficulty, puzzleLevel);

    if (!data) {
      ol.style.display = 'none';
      updatePuzzleUI('error', 'Could not load puzzle. Make sure puzzles.json is in your repo.');
      return;
    }'''

if old_candidate in src:
    src = src.replace(old_candidate, new_candidate)
    print("✓ Replaced candidate loading block")
else:
    print("✗ Could not find candidate loading block — searching for partial match...")
    # Try to find it
    idx = src.find('const MAX_ATTEMPTS = 10;')
    if idx >= 0:
        print(f"  Found MAX_ATTEMPTS at char {idx}")
        print(f"  Context: {src[idx-200:idx+100]}")

# ── 3. Update PUZZLE_LEVELS from 50 to 1000 ─────────────────────────────────
src = src.replace('const PUZZLE_LEVELS = 50;', 'const PUZZLE_LEVELS = 1000;')
print("✓ PUZZLE_LEVELS = 1000")

# ── 4. Remove puzzleOfflineMode since we don't need it anymore ───────────────
src = src.replace(
    "  let puzzleOfflineMode = true; // default: offline. User can toggle to online.\n  // Online mode tries Lichess API, offline uses local puzzle bank only\n",
    ""
)

# ── 5. Update the level bar title to show total ─────────────────────────────
src = src.replace(
    "if (title) title.textContent = PUZZLE_DIFFICULTIES[puzzleDifficulty].label.toUpperCase() + ' LEVELS';",
    "if (title) title.textContent = PUZZLE_DIFFICULTIES[puzzleDifficulty].label.toUpperCase() + ' — 1000 LEVELS';"
)

# ── 6. Remove OFFLINE_PUZZLES giant array ─────────────────────────────────────
# Find it
start = src.find('  // Built-in fallback puzzles (always available, no internet needed)\n  const OFFLINE_PUZZLES = [')
if start >= 0:
    end = src.find('\n  ];', start) + 5
    removed_size = end - start
    src = src[:start] + src[end:]
    print(f"✓ Removed OFFLINE_PUZZLES ({removed_size} chars)")
else:
    print("✗ OFFLINE_PUZZLES not found")

# ── 7. Remove cache/download functions no longer needed ─────────────────────
# Keep them for now to avoid breaking references, just make them no-ops
# Actually the updatePuzzleUI still references downloadPuzzles/cacheCount, let's clean that too
old_playing_cache = '''          ${!puzzleOfflineMode && cacheCount < cacheTarget ? `
          <div style="margin-bottom:8px;">
            <div style="font-size:0.62rem;color:var(--muted);margin-bottom:3px;">Lichess cache: ${cacheCount}/${cacheTarget}</div>
            <div style="height:2px;background:var(--surface2);border-radius:2px;margin-bottom:5px;"><div style="height:100%;width:${cacheBar}%;background:${cacheBar>=80?'var(--green)':cacheBar>=40?'#f5c518':'var(--red)'};border-radius:2px;"></div></div>
            <button onclick="downloadPuzzles()" id="dlBtn" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--muted);font-family:'DM Sans',sans-serif;font-size:0.68rem;padding:5px;border-radius:7px;cursor:pointer;">⬇ Cache Lichess puzzles</button>
          </div>` : ''}'''

new_playing_cache = ''  # Remove it

src = src.replace(old_playing_cache, new_playing_cache)
print("✓ Removed cache download UI")

# ── 8. Remove cache-related code from playing state ─────────────────────────
old_cache_vars = '''      const cache = getPuzzleCache();
      const cacheCount = (cache[puzzleDifficulty]||[]).length;
      const cacheTarget = CACHE_TARGETS[puzzleDifficulty];
      const cacheBar = Math.round((cacheCount/cacheTarget)*100);

      '''
src = src.replace(old_cache_vars, '      ')
print("✓ Removed cache vars from updatePuzzleUI")

# ── 9. Remove offline mode toggle from buildPuzzleHeader ────────────────────
old_mode_toggle = '''    const modeColor = puzzleOfflineMode ? '#aaa' : '#3ddc84';
    const modeBg = puzzleOfflineMode ? '#33333388' : '#3ddc8422';
    const modeLabel = puzzleOfflineMode ? '📴 Offline' : '🌐 Online';
    return `
      <div style="display:flex;gap:4px;margin-bottom:7px;">${diffTabs}</div>
      <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">
        <button onclick="puzzleOfflineMode=!puzzleOfflineMode;updatePuzzleUI('playing')"
          style="padding:3px 9px;border-radius:6px;border:1px solid ${modeColor};background:${modeBg};
          color:${modeColor};font-size:0.63rem;font-weight:700;cursor:pointer;">${modeLabel}</button>
      </div>`;'''

new_mode_toggle = '''    return `<div style="display:flex;gap:4px;margin-bottom:7px;">${diffTabs}</div>`;'''

src = src.replace(old_mode_toggle, new_mode_toggle)
print("✓ Removed offline mode toggle")

with open(sys.argv[1], 'w') as f:
    f.write(src)

print(f"\nDone! File size: {len(src)} chars")