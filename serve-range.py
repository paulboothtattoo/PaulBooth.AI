from __future__ import annotations

import argparse
import os
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class RangeRequestHandler(SimpleHTTPRequestHandler):
    """Static-file server with HTTP byte-range support for audio/video seeking."""

    protocol_version = "HTTP/1.1"

    def send_head(self):
        path = self.translate_path(self.path)

        if os.path.isdir(path):
            parts = self.path.split("?", 1)[0].split("#", 1)[0]
            if not parts[-1].endswith("/"):
                self.send_response(301)
                self.send_header("Location", parts[-1] + "/")
                self.end_headers()
                return None

            for index in ("index.html", "index.htm"):
                candidate = os.path.join(path, index)
                if os.path.isfile(candidate):
                    path = candidate
                    break
            else:
                return self.list_directory(path)

        try:
            file = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        stat = os.fstat(file.fileno())
        size = stat.st_size
        content_type = self.guess_type(path)

        range_header = self.headers.get("Range")
        if range_header:
            match = re.match(r"bytes=(\d*)-(\d*)$", range_header.strip())
            if not match:
                file.close()
                self.send_error(416, "Invalid byte range")
                return None

            start_text, end_text = match.groups()

            if start_text:
                start = int(start_text)
                end = int(end_text) if end_text else size - 1
            else:
                suffix_length = int(end_text)
                start = max(0, size - suffix_length)
                end = size - 1

            if start >= size or start > end:
                file.close()
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.end_headers()
                return None

            end = min(end, size - 1)
            length = end - start + 1

            self.send_response(206)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Accept-Ranges", "bytes")
            self.send_header("Content-Length", str(length))
            self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()

            file.seek(start)
            self.range = (start, end)
            return file

        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(size))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Last-Modified", self.date_time_string(stat.st_mtime))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()

        self.range = None
        return file

    def copyfile(self, source, outputfile):
        if getattr(self, "range", None):
            start, end = self.range
            remaining = end - start + 1
            while remaining > 0:
                chunk = source.read(min(64 * 1024, remaining))
                if not chunk:
                    break
                outputfile.write(chunk)
                remaining -= len(chunk)
        else:
            super().copyfile(source, outputfile)


def main():
    parser = argparse.ArgumentParser(
        description="Serve a static website with byte-range support for audio/video seeking."
    )
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--directory", default=".")
    args = parser.parse_args()

    directory = Path(args.directory).resolve()
    os.chdir(directory)

    server = ThreadingHTTPServer(("0.0.0.0", args.port), RangeRequestHandler)
    print(f"Serving {directory} at http://localhost:{args.port}")
    print("Byte-range support is enabled for audio/video seeking.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
