: このバッチファイルは環境依存です。
: This .bat is Environment dependency.

@echo off
cd /d %~dp0

mkdir Build
mkdir Build\BCV

set Source=.
set Destination=Build\BCV

xcopy /Y /e %Source%\css %Destination%\css\
xcopy /Y /e %Source%\img %Destination%\img\
xcopy /Y /e %Source%\js %Destination%\js\
xcopy /Y /e %Source%\lib %Destination%\lib\
xcopy /Y /e %Source%\node_modules %Destination%\node_modules\
copy /Y %Source%\index.html %Destination%\
copy /Y %Source%\setting.html %Destination%\
copy /Y %Source%\package.json %Destination%\

pause