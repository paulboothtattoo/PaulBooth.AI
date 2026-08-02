PaulBooth.ai only

This patch fixes vertical YouTube poster overlays and vertical player sizing.

What changed:
- vertical YouTube previews now use a true 9:16 outer frame
- overlay still images now fill the portrait frame instead of sitting small inside a black box
- motion and machines vertical cards no longer stretch with excessive empty space
- landscape videos remain 16:9

Copy these files into the site root, replace existing files, restart the local Python server, and hard refresh (Ctrl+F5).
