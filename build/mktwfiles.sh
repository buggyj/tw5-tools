 find ../files -type f -exec ls {} \; 2> /dev/null| cut -c 10- | ./twfileshelper.sh >../files/tw.files
