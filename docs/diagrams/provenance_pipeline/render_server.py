"""Serves render.html and saves the SVGs it renders into the Provenance Pipeline page's image slots.

Run it, then open http://localhost:3201/render.html in a browser:

    python docs/diagrams/provenance_pipeline/render_server.py

It listens on 127.0.0.1 only, and writes only files named like en/Provenance_Governance_EN.svg.
"""
import http.server
import os
import re
import sys
from urllib.parse import parse_qs, urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
OUT = os.path.join(REPO, "app", "assets", "images", "projects", "provenance_pipeline")
NAME = re.compile(r"^(en|pt)/Provenance_[A-Za-z]+_(EN|PT)\.svg$")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HERE, **kwargs)

    def do_POST(self):
        url = urlparse(self.path)
        name = parse_qs(url.query).get("file", [""])[0]
        if url.path != "/save" or not NAME.match(name):
            self.send_error(400, "expected /save?file=en/Provenance_Name_EN.svg")
            return
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        path = os.path.join(OUT, *name.split("/"))
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as fh:
            fh.write(body)
        print(f"saved {path} ({len(body)} bytes)", flush=True)
        self.send_response(204)
        self.end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3201
    print(f"serving {HERE} on http://localhost:{port}/render.html", flush=True)
    http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
