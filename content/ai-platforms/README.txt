DROP FILES FOR: AI Platforms

Supported media:
- Images: jpg, jpeg, png, webp, gif, avif
- Video: mp4, webm, mov
- Audio: mp3, wav, ogg, m4a
- Documents: pdf

Optional metadata:
Create a JSON file with the same base filename as the media file.

Example:
my-project.jpg
my-project.json

JSON format:
{
  "title": "My Project",
  "description": "A short description.",
  "type": "AI Platforms",
  "status": "Completed",
  "date": "2026",
  "link": "https://example.com"
}

Without metadata, the site automatically converts the filename into a title.
Example: biomechanical-machine-study.jpg becomes "Biomechanical Machine Study".
