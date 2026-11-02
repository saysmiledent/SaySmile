#!/usr/bin/env bash
# Free video tools for SaySmile reels: Remotion, HyperFrames, Manim, plus the Vazirmatn font.
# Usage: bash scripts/video/setup.sh [dir]   (default ~/video-tools). Safe to run again.
set -e
DIR="${1:-$HOME/video-tools}"
mkdir -p "$DIR" && cd "$DIR"

# Persian brand font for all three tools
if ! fc-list | grep -qi vazirmatn; then
  git clone -q --depth 1 https://github.com/rastikerdar/vazirmatn.git /tmp/vazirmatn
  mkdir -p ~/.fonts && cp /tmp/vazirmatn/fonts/ttf/Vazirmatn-*.ttf ~/.fonts/ && fc-cache -f >/dev/null
fi

# Remotion + HyperFrames (+ local GSAP, the CDN may be blocked)
[ -f package.json ] || npm init -y >/dev/null
npm i -s remotion@4.0.540 @remotion/cli@4.0.540 @remotion/renderer@4.0.540 @remotion/bundler@4.0.540 \
  react@18.3.1 react-dom@18.3.1 hyperframes@0.9.6 gsap@3.15.0

# Manim needs Pango headers to build
apt-get install -y -q libpango1.0-dev pkg-config >/dev/null 2>&1 || (apt-get update -q >/dev/null && apt-get install -y -q libpango1.0-dev pkg-config >/dev/null)
pip install --break-system-packages -q manim

# Chrome for Remotion (--browser-executable) and HyperFrames (HYPERFRAMES_BROWSER_PATH)
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1)
echo "Ready in $DIR"
echo "Remotion:    npx remotion render <entry> <Comp> out.mp4 --browser-executable=$HS"
echo "HyperFrames: HYPERFRAMES_BROWSER_PATH=$HS npx hyperframes render -o out.mp4 --no-browser-gpu"
echo "Manim:       manim -qh --format mp4 scene.py Scene"
