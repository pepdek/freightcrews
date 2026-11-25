// Shared by the gate scripts: the built pages, a tiny static server, and report writing.
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const DIST = join(ROOT, "dist");

export function pages(): { file: string; path: string }[] {
  if (!existsSync(DIST)) throw new Error("dist/ not found. Run `npm run build` first.");
  return (readdirSync(DIST, { recursive: true }) as string[])
    .filter((f) => f.endsWith(".html"))
    .sort()
    .map((f) => ({ file: join(DIST, f), path: "/" + relative(DIST, join(DIST, f)).split(sep).join("/").replace(/index\.html$/, "") }));
}

export function report(name: string, text: string) {
  mkdirSync(join(ROOT, "reports"), { recursive: true });
  writeFileSync(join(ROOT, "reports", name), text.endsWith("\n") ? text : text + "\n");
}

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".avif": "image/avif", ".webp": "image/webp",
  ".woff2": "font/woff2", ".woff": "font/woff", ".xml": "application/xml", ".txt": "text/plain",
};

/** Serves dist/ with gzip, like the production host. A POST gets the page back, as Netlify Forms does. */
export async function serve() {
  const server = createServer((req, res) => {
    let path = normalize(decodeURIComponent(new URL(req.url!, "http://localhost").pathname));
    if (path.endsWith("/")) path += "index.html";
    let file = join(DIST, path);
    let status = 200;
    if (!file.startsWith(DIST) || !existsSync(file) || !statSync(file).isFile()) {
      file = join(DIST, "404.html");
      status = 404;
    }
    const type = types[extname(file)] ?? "application/octet-stream";
    const compress = /text|javascript|xml|svg/.test(type) && /gzip/.test(String(req.headers["accept-encoding"]));
    const body = readFileSync(file);
    res.writeHead(status, {
      "content-type": type,
      "cache-control": file.includes(`${sep}_astro${sep}`) ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
      ...(compress && { "content-encoding": "gzip" }),
    });
    res.end(compress ? gzipSync(body) : body);
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const { port } = server.address() as { port: number };
  return { url: `http://localhost:${port}`, close: () => (server.closeAllConnections(), server.close()) };
}
