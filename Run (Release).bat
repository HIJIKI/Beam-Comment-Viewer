: このバッチファイルは環境依存です。
: This .bat is Environment dependency.

@echo off
cd /d %~dp0

: NW.js にパスを通す必要があります。
nw .
