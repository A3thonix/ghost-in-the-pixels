const output = document.querySelector("#terminalOutput");
const input = document.querySelector("#commandInput");
const cwd = document.querySelector("#cwd");
const history = [];
let historyIndex = 0;
const state = { directory: "~/challenge", discovered: new Set() };

const responses = {
  help: `Available commands:
  ls [-la]              list evidence files
  pwd                   print working directory
  file <file>           identify file signature
  exiftool <file>       inspect metadata
  binwalk <file>        scan for embedded data
  zsteg <file>          analyze pixel bit planes
  strings <file>        print readable strings
  xxd <file>            inspect hexadecimal bytes
  pngcheck <file>       validate PNG structure
  clear                 clear terminal`,
  "ls -la": `total 4.3M
-rw-r--r-- 1 guest guest 4.2M Sep 11 14:32 ghost.png
-rw-r--r-- 1 guest guest  236 Sep 11 14:32 readme.txt
-r--r--r-- 1 guest guest   91 Sep 11 14:32 checksum.txt`,
  ls: `ghost.png  readme.txt  checksum.txt`,
  pwd: `/home/guest/challenge`,
  "file ghost.png": `ghost.png: PNG image data, 1920 x 1080, 8-bit/color RGB, non-interlaced`,
  "cat readme.txt": `Recovered from: /srv/archive/node-07/
Acquisition status: PARTIAL
Do not modify the original evidence.
SHA256: 7c9f2b8d...e11a`,
  "exiftool ghost.png": `ExifTool Version Number         : 12.76
File Name                       : ghost.png
File Size                       : 4.2 MB
Image Width                     : 1920
Image Height                    : 1080
Color Type                      : RGB
Comment                        : beneath_the_visible_channel
Warning                         : [minor] Trailer data`,
  "binwalk ghost.png": `DECIMAL       HEXADECIMAL     DESCRIPTION
0             0x0             PNG image, 1920 x 1080
4289910       0x417876        Zlib compressed data
4290218       0x4179AA        Zip archive data, encrypted
Note: use --dd='.*' to carve the appended object.`,
  "zsteg ghost.png": `imagedata           .. file: PNG image data
b1,r,lsb,xy         .. text: "look beneath the visible channel"
b2,rgb,msb,xy       .. file: Zip archive data
b4,r,lsb,xy         .. text: "c2Vjb25kX2xheWVy"`,
  "strings ghost.png": `IEND
tEXtComment
VF/relay/07
.........(binary data omitted)`,
  "pngcheck ghost.png": `File: ghost.png (4290312 bytes)
OK: PNG signature, 4 chunks, 1920 x 1080, 8-bit RGB`,
  "xxd ghost.png": `00000000: 8950 4e47 0d0a 1a0a 0000 000d 4948 4452
004179a0: 504b 0304 1400 0900 0800 ... ZIP header`,
};
const aliases = {"exiftool": "exiftool ghost.png", "binwalk": "binwalk ghost.png", "zsteg": "zsteg ghost.png", "file": "file ghost.png", "pngcheck": "pngcheck ghost.png"};

function line(text, kind = "output") {
  const node = document.createElement("div");
  node.className = kind;
  node.textContent = text;
  output.append(node);
  output.scrollTop = output.scrollHeight;
}
function markProgress(command) {
  const checks = [["ls", "inspect"], ["file", "analyze"], ["exiftool", "identify"], ["zsteg", "identify"], ["binwalk", "extract"], ["7z", "password"], ["openssl", "decode"]];
  checks.forEach(([prefix, objective]) => { if (command.startsWith(prefix)) document.querySelector(`[data-objective="${objective}"]`)?.classList.add("done"); });
  const done = document.querySelectorAll(".objectives li.done").length;
  document.querySelector("#objectiveCount").textContent = `${done} / 7`;
  document.querySelector("#progressLabel").textContent = `${Math.round(done / 7 * 100)}%`;
  document.querySelector("#progressBar").style.width = `${done / 7 * 100}%`;
}
function run(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;
  history.push(raw); historyIndex = history.length;
  line(`┌──(kali㉿ghost)-[${state.directory}]`, "boot");
  line(`└─$ ${raw}`, "boot");
  if (command === "clear") { output.innerHTML = ""; return; }
  const key = responses[command] || responses[aliases[command]];
  if (key) { key.split("\n").forEach((text) => line(text)); markProgress(command); }
  else if (command === "cd ..") { state.directory = "~"; cwd.textContent = "~"; line(""); }
  else if (command.startsWith("cd ")) { state.directory = "~/challenge"; cwd.textContent = state.directory; line(""); }
  else if (command.startsWith("unzip") || command.startsWith("7z")) { line("Archive: fragment.zip\n extracting: fragment.txt", "output"); markProgress(command); }
  else if (command.startsWith("base64") || command.startsWith("openssl")) { line("Salted__\nU2FsdGVkX1... [encrypted payload detected]", "output"); markProgress(command); }
  else { line(`bash: ${command.split(/\s+/)[0]}: command not found`, "error"); }
}
document.querySelector(".terminal-input").addEventListener("submit", (event) => { event.preventDefault(); run(input.value); input.value = ""; });
input.addEventListener("keydown", (event) => { if (event.key === "ArrowUp") { historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || ""; } if (event.key === "ArrowDown") { historyIndex = Math.min(history.length, historyIndex + 1); input.value = history[historyIndex] || ""; } });
document.querySelectorAll("[data-command]").forEach((button) => button.addEventListener("click", () => { input.value = button.dataset.command; input.focus(); }));
document.querySelectorAll("[data-hint]").forEach((button) => button.addEventListener("click", () => { button.disabled = true; document.querySelector("#hintMessage").textContent = button.dataset.hint; }));
document.querySelector("#contrastButton").addEventListener("click", () => document.body.classList.toggle("high-contrast"));
document.querySelector("#resetButton").addEventListener("click", () => { output.innerHTML = ""; state.directory = "~/challenge"; cwd.textContent = state.directory; line("┌──(kali㉿ghost)-[~/challenge]", "boot"); line("└─$ _", "boot"); line("[+] Evidence workspace remounted read-only", "system"); });
document.querySelector("#downloadButton").addEventListener("click", () => { line("evidence_bundle.tar.gz queued for download", "system"); });
document.querySelector("#flagForm").addEventListener("submit", (event) => { event.preventDefault(); const message = document.querySelector("#formMessage"); message.className = ""; message.textContent = document.querySelector("#flagInput").value.trim().startsWith("CTF{") ? "✕ Incorrect flag. Keep investigating." : "✕ Invalid format. Expected CTF{...}"; message.classList.add("failure"); });
