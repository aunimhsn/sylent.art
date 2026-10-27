"""Serves the repository root for the mock-ups, like `python3 -m http.server`, but tells the
browser never to cache: after a change, a reload always gets every file of the mock-up (pages and
shared/), never a mix of old and new ones.

    python3 docs/mockups/serve.py 8781

from the repository root, then open http://127.0.0.1:8781/docs/mockups/home.html
"""

import http.server
import sys


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8781
http.server.ThreadingHTTPServer(("127.0.0.1", port), NoCache).serve_forever()
