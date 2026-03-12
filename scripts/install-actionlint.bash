#!/bin/bash
# Downloads actionlint binary into node_modules/.bin/ so it's available
# for pnpm scripts and lint-staged without requiring Go or brew.
# Based on https://github.com/rhysd/actionlint/blob/main/scripts/download-actionlint.bash

set -euo pipefail

VERSION="1.7.10"
TARGET_DIR="$(cd "$(dirname "$0")/../node_modules/.bin" && pwd)"
BINARY="$TARGET_DIR/actionlint"

if [ -x "$BINARY" ] && "$BINARY" -version 2>/dev/null | grep -q "$VERSION"; then
  echo "actionlint v${VERSION} already installed"
  exit 0
fi

case "$OSTYPE" in
  linux*)   os=linux;   ext=tar.gz ;;
  darwin*)  os=darwin;  ext=tar.gz ;;
  msys|cygwin|win32) os=windows; ext=zip ;;
  *) echo "Unsupported OS: $OSTYPE" >&2; exit 1 ;;
esac

machine="$(uname -m)"
case "$machine" in
  x86_64)       arch=amd64 ;;
  i?86)         arch=386 ;;
  aarch64|arm64) arch=arm64 ;;
  arm*)         arch=armv6 ;;
  *) echo "Unsupported arch: $machine" >&2; exit 1 ;;
esac

file="actionlint_${VERSION}_${os}_${arch}.${ext}"
url="https://github.com/rhysd/actionlint/releases/download/v${VERSION}/${file}"

echo "Downloading actionlint v${VERSION} (${os}/${arch})..."
mkdir -p "$TARGET_DIR"

if [ "$os" = "windows" ]; then
  tmpdir="$(mktemp -d)"
  curl -sSL -o "$tmpdir/tmp.zip" "$url"
  unzip -o "$tmpdir/tmp.zip" actionlint.exe -d "$TARGET_DIR"
  rm -rf "$tmpdir"
else
  curl -sSL "$url" | tar xz -C "$TARGET_DIR" actionlint
fi

echo "Installed: $("$BINARY" -version)"
