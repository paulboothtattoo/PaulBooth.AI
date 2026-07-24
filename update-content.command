#!/bin/bash
cd "$(dirname "$0")"
node build-content-manifest.js
read -p "Press Enter to close..."
