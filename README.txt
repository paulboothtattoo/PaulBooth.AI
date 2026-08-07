PaulBooth.ai — Mobile title overflow fix

This safely modifies the CURRENT local index.html in place.
It does not replace the page with an older copy.

It overrides the old mobile/title rules that forced:
white-space: nowrap
overflow: visible

The patch allows titles to wrap naturally within the phone width,
prevents horizontal page overflow, and keeps desktop styling unchanged.

Run from the PaulBooth.ai repo root:

powershell -ExecutionPolicy Bypass -File ".\PaulBooth.ai-mobile-title-overflow-fix\apply-mobile-title-fix.ps1" -SiteRoot "."

Then:
git add index.html
git commit -m "Fix mobile title overflow"
git push origin main
