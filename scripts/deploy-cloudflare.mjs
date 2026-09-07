import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const npmCommand = process.platform === "win32" ? "npx.cmd" : "npx";

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: "inherit" });
}

run(npmCommand, ["opennextjs-cloudflare", "build"]);

const video = path.join(root, ".open-next", "assets", "videos", "site-internet-landing.mp4");
if (existsSync(video) && statSync(video).size > 25 * 1024 * 1024) {
  const compressed = `${video}.compressed.mp4`;
  run("ffmpeg", [
    "-y",
    "-i",
    video,
    "-vf",
    "scale=-2:720",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "30",
    compressed,
  ]);
  run(process.platform === "win32" ? "cmd.exe" : "mv", process.platform === "win32"
    ? ["/c", "move", "/Y", compressed, video]
    : [compressed, video]);
}

// OpenNext 1.x can emit an empty Windows working directory. The generated
// bundle works without changing directory when deployed to Workers.
const handler = path.join(root, ".open-next", "server-functions", "default", "handler.mjs");
if (existsSync(handler)) {
  const source = readFileSync(handler, "utf8");
  const patched = source.replace(
    "function setNextjsServerWorkingDirectory(){process.chdir(\"\")}",
    "function setNextjsServerWorkingDirectory(){}",
  );
  if (patched !== source) writeFileSync(handler, patched);
}

run(npmCommand, ["wrangler", "deploy", ".open-next/worker.js"]);
