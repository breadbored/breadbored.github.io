#!/bin/bash
set -e

# Wonderful Toolchain Installer
# Usage: curl -fsSL https://bread.codes/scripts/wonderful.sh | bash

# Detect architecture
ARCH=$(uname -m)
case "$ARCH" in
    x86_64)
        BOOTSTRAP_URL="https://wonderful.asie.pl/bootstrap/wf-bootstrap-x86_64.tar.gz"
        ;;
    aarch64|arm64)
        BOOTSTRAP_URL="https://wonderful.asie.pl/bootstrap/wf-bootstrap-aarch64.tar.gz"
        ;;
    *)
        exit 1
        ;;
esac

if [ ! -d "/opt/wonderful" ]; then
    sudo mkdir -p /opt/wonderful
fi

sudo chown -R "$USER" /opt/wonderful

TEMP_FILE=$(mktemp)

trap "rm -f $TEMP_FILE" EXIT

if command -v curl &> /dev/null; then
    curl -fsSL "$BOOTSTRAP_URL" -o "$TEMP_FILE"
elif command -v wget &> /dev/null; then
    wget -q "$BOOTSTRAP_URL" -O "$TEMP_FILE"
else
    exit 1
fi

cd /opt/wonderful/

tar xzf "$TEMP_FILE"

/opt/wonderful/bin/wf-pacman -Syu wf-tools

echo "Wonderful toolchain installed successfully."

wf-pacman -S target-gba target-gba-libtonc
