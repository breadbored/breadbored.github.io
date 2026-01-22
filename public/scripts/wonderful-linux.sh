#!/bin/bash

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
        echo "Error: Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

if [ ! -d "/opt/wonderful" ]; then
    if ! sudo mkdir -p /opt/wonderful; then
        echo "Error: Failed to create /opt/wonderful directory"
        exit 2
    fi
fi

if ! sudo chown -R "$USER" /opt/wonderful; then
    echo "Error: Failed to change ownership of /opt/wonderful"
    exit 3
fi

TEMP_FILE=$(mktemp)
if [ -z "$TEMP_FILE" ]; then
    echo "Error: Failed to create temporary file"
    exit 4
fi

trap "rm -f $TEMP_FILE" EXIT

if command -v curl &> /dev/null; then
    if ! curl -fsSL "$BOOTSTRAP_URL" -o "$TEMP_FILE"; then
        echo "Error: Failed to download bootstrap"
        exit 5
    fi
elif command -v wget &> /dev/null; then
    if ! wget -q "$BOOTSTRAP_URL" -O "$TEMP_FILE"; then
        echo "Error: Failed to download bootstrap"
        exit 5
    fi
else
    echo "Error: Neither curl nor wget found"
    exit 6
fi

if ! cd /opt/wonderful/; then
    echo "Error: Failed to change to /opt/wonderful directory"
    exit 7
fi

if ! tar xzf "$TEMP_FILE"; then
    echo "Error: Failed to extract bootstrap"
    exit 8
fi

if ! /opt/wonderful/bin/wf-pacman -Syu wf-tools target-gba target-gba-libtonc; then
    echo "Error: Failed to install wf-tools"
    exit 9
fi

source /opt/wonderful/bin/wf-env

echo "Wonderful toolchain installed successfully."
