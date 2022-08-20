@echo off

IF not exist util\archiver\arc.exe (
    set GOBIN=%cd%\util\archiver
    go install github.com/mholt/archiver/v3/cmd/arc@latest
)

IF not exist dart-sass (
    util\curl\bin\curl.exe --progress-bar -Lo dart-sass.zip https://github.com/sass/dart-sass/releases/download/1.54.4/dart-sass-1.54.4-windows-x64.zip
    util\archiver\arc unarchive dart-sass.zip
    del dart-sass.zip
)
