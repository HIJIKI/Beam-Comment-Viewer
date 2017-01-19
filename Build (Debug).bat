: このバッチファイルは環境依存です。

@echo off
cd /d %~dp0

: 7-Zip のコマンドライン版が必要です。
mkdir tmp
"7zip/7za.exe" a -tzip -ssw -mx=0 .\tmp\app.nw @BuildInclude.txt

: NW.js が必要です。
mkdir bin
mkdir bin\Debug
copy /b D:\Software\Cording\nwjs-v0.19.5-win-x64\nw.exe+tmp\app.nw ".\bin\Debug\Beam Comment Viewer.exe"

pause