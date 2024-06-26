@echo off
setlocal enabledelayedexpansion

for %%f in (*.css) do (
    set "oldname=%%f"
    set "newname=%%~nf.scss"
    ren "!oldname!" "!newname!"
)

endlocal