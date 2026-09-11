# GHOST IN THE PIXELS

**A3thonix 2.0 // Steganography & Digital Forensics CTF**

`GHOST IN THE PIXELS` is a standalone, browser-based hard steganography challenge with an original purple, black, and white forensic operations interface.

## Challenge

A compromised intelligence workstation recovered a single image from an abandoned Linux server. It looks ordinary. The analyst who extracted it left only one note:

> “The pixels remember what the filesystem forgot.”

The intended investigation combines metadata analysis, pixel steganography, file carving, archive handling, password recovery, and payload decoding.

## Features

- Kali-inspired interactive terminal with a realistic `kali㉿ghost` prompt
- Simulated forensic commands: `ls`, `file`, `exiftool`, `binwalk`, `zsteg`, `strings`, `xxd`, `pngcheck`, `7z`, and more
- Command history with arrow-key navigation
- Attack machine panel with VPN, IP, uptime, and evidence controls
- Progressive objectives and point-cost hints
- Responsive desktop, laptop, tablet, and mobile layout
- High-contrast mode
- Original UI and branding by A3thonix 2.0

## Run locally

No build step or dependencies are required. Open `index.html` in a browser:

```text
index.html
```

For a local HTTP server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project structure

```text
index.html   challenge interface
styles.css   visual system and responsive layout
app.js       terminal emulator and challenge interactions
```

## GitHub Pages

This is a static site and can be hosted directly with GitHub Pages. In repository settings, open **Pages**, choose **Deploy from a branch**, select the default branch and `/ (root)`, then save.

## Credits

Created by **A3thonix 2.0**.
