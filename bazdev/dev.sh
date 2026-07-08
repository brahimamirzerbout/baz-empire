#!/usr/bin/env bash
source "$HOME/.cargo/env"
export PATH="$HOME/.local/share/fnm/node-versions/v22.23.0/installation/bin:$HOME/.cargo/bin:$HOME/bazdev/root/usr/bin:$PATH"
export PKG_CONFIG_PATH="/home/uzer/bazdev/root/usr/lib/x86_64-linux-gnu/pkgconfig:/home/uzer/bazdev/root/usr/lib/pkgconfig:/home/uzer/bazdev/root/usr/share/pkgconfig"
export LIBRARY_PATH="/home/uzer/bazdev/root/usr/lib/x86_64-linux-gnu:/home/uzer/bazdev/root/usr/lib"
export C_INCLUDE_PATH="/home/uzer/bazdev/root/usr/include:/home/uzer/bazdev/root/usr/include/x86_64-linux-gnu"
cd /home/uzer/empire/marketing-hub
exec pnpm tauri dev