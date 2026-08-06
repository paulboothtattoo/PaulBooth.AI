PAULBOOTH.AI — VISIONS GALLERIES UPDATE

Copy these files into the root of the existing PaulBooth.ai repository.
Do not delete or replace the rest of the site.

This update:
- hides every individual image title and caption
- keeps eight images across on wide desktop screens
- blocks right-click, dragging, copying, and common save shortcuts as download deterrence
- discovers every supported image in content/visual-work and distributes them evenly across all three galleries

For guaranteed production discovery, run this once from PowerShell in the website root:
  .\build-visual-work-manifest.ps1

The script creates content/visual-work/visual-work-manifest.json from every PNG, JPG, JPEG, WEBP, GIF, and AVIF in that folder.
