#!/bin/bash
# Auto-update modDatetime when blog post markdown files are edited by Claude

INPUT=$(cat)

FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    fp = data.get('tool_input', {}).get('file_path', '')
    print(fp)
except:
    print('')
" 2>/dev/null)

# Only process blog post markdown files (not usage guides, READMEs, etc.)
if [[ -n "$FILE_PATH" && "$FILE_PATH" == *"src/data/blog"* && "$FILE_PATH" == *.md ]]; then
    CURRENT_TIME=$(TZ="Asia/Seoul" date +"%Y-%m-%dT%H:%M:%S+09:00")

    python3 - <<PYEOF
import re, sys

file_path = "$FILE_PATH"
current_time = "$CURRENT_TIME"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Only process files that have frontmatter
    if not content.startswith('---'):
        sys.exit(0)

    if 'modDatetime:' in content:
        # Update existing modDatetime value
        content = re.sub(r'modDatetime:.*\n', f'modDatetime: {current_time}\n', content)
    else:
        # Add modDatetime after pubDatetime line
        content = re.sub(r'(pubDatetime:.*\n)', r'\1modDatetime: ' + current_time + '\n', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
except Exception as e:
    sys.exit(0)
PYEOF
fi
