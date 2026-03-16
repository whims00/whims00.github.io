"""
Run this from your whims00.github.io repo folder:
  python3 add_chat_widget.py

It adds <script src="chat-widget.js"></script> before </body>
in every .html file, skipping chat.html itself.
"""

import os
import glob

SNIPPET = '<script src="chat-widget.js"></script>'
SKIP = {'chat.html', 'login.html', 'verified.html'}

html_files = glob.glob('*.html')

for filename in html_files:
    if filename in SKIP:
        print(f'  SKIP  {filename}')
        continue

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Don't add twice
    if 'chat-widget.js' in content:
        print(f'  SKIP  {filename} (already has it)')
        continue

    if '</body>' not in content:
        print(f'  SKIP  {filename} (no </body> tag)')
        continue

    # Inject before </body>
    new_content = content.replace('</body>', f'  {SNIPPET}\n</body>', 1)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f'  DONE  {filename}')

print('\nAll done!')