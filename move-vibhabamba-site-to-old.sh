#!/usr/bin/env bash
set -euo pipefail

# Run this from the root of the vibhabamba.com repository on the gh-pages branch.

if [[ ! -f "index.html" || ! -d "css" || ! -d "images" || ! -d "js" ]]; then
  echo "Error: run this script from the vibhabamba.com repository root." >&2
  exit 1
fi

# Refuse to overwrite an existing archive without an explicit backup.
if [[ -e "old" ]]; then
  backup="old-backup-$(date +%Y%m%d-%H%M%S)"
  echo "Existing old/ folder found; moving it to $backup"
  mv old "$backup"
fi

mkdir -p old

# Create a self-contained archive of the current portfolio.
cp index.html old/index.html
cp -R css old/css
cp -R images old/images
cp -R js old/js

if [[ -f "VibhaBamba_2015.pdf" ]]; then
  cp VibhaBamba_2015.pdf old/VibhaBamba_2015.pdf
fi

# Point the archived page at its archived assets.
python3 - <<'PY'
from pathlib import Path

path = Path("old/index.html")
html = path.read_text(encoding="utf-8")
replacements = {
    'href="/css/': 'href="/old/css/',
    'src="/images/': 'src="/old/images/',
    'href="/images/': 'href="/old/images/',
    'src="/js/': 'src="/old/js/',
    'href="VibhaBamba_2015.pdf"': 'href="/old/VibhaBamba_2015.pdf"',
}
for old, new in replacements.items():
    html = html.replace(old, new)
path.write_text(html, encoding="utf-8")
PY

# Leave the root ready for the new website, without affecting /quiettime.
cat > index.html <<'HTML'
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vibha Bamba</title>
  <meta name="description" content="Vibha Bamba">
  <link rel="icon" href="/old/images/favicon-16.png" sizes="16x16">
  <link rel="icon" href="/old/images/favicon-32.png" sizes="32x32">
  <style>
    html, body { margin: 0; min-height: 100%; background: #fff; }
  </style>
</head>
<body></body>
</html>
HTML

printf '\nPrepared changes:\n'
printf '  • Archived portfolio: https://vibhabamba.com/old/\n'
printf '  • Homepage: blank and ready for replacement\n'
printf '  • Quiet Time: unchanged at https://vibhabamba.com/quiettime/\n\n'
printf 'Review with: git diff --stat && git status\n'
printf 'Publish with: git add index.html old && git commit -m "Archive portfolio at /old" && git push origin gh-pages\n'