# This powershell script is designed to remove the top line of an webpack stats.json output. On windows
# this file is output with the directory from which it is run on the first line of the file. This line needs 
# to be removed to run the subsequent file through webpack analyzers
set-variable -Name "file" -Value "stats.json"
get-content $file |
    select -Skip 1 |
    set-content "$file-temp"
move "$file-temp" $file -Force