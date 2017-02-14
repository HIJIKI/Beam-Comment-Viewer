: このバッチファイルは環境依存です。

@echo off
cd /d %~dp0

: NW.js (SDK) にパスを通して nw.exe を nwd.exe にリネームしておく必要があります。
nwd .
