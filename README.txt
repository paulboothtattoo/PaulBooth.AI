PAULBOOTH.AI — BACKEND-EDITABLE VISIONS GALLERIES + IMAGE DETERRENTS

Replace/add these root files:
- index.html
- visions-galleries.css
- visions-galleries.js
- visions-galleries.json
- image-protection.css
- image-protection.js

No public editing controls appear on the website.

BACKEND GALLERY EDITING
1. Put image files in content/visions/
2. Open visions-galleries.json in a text editor.
3. Edit gallery titles, descriptions, image paths, captions, and order.
4. Save and refresh the site.

Example image path:
content/visions/my-image.jpg

To hide a gallery or image:
"hidden": true

IMAGE PROTECTION
This package deters casual downloading by:
- disabling right-click on images
- disabling image dragging
- disabling touch-callout/save-image behavior
- placing a transparent interaction layer over Visions gallery images
- blocking Ctrl/Cmd+S and Ctrl/Cmd+U

Important: no image displayed in a web browser can be made truly undownloadable.
A determined user can still obtain it through browser developer tools, network requests,
screenshots, or cached files. Watermarking and lower-resolution public copies provide
stronger practical protection.
