#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <PDF file>"
    exit 1
fi

info=$(pdfinfo "$1")
width=$(echo "$info" | grep "Page size" | awk '{print $3}')
height=$(echo "$info" | grep "Page size" | awk '{print $5}')
rotate=$(echo "$info" | grep "Page rot" | awk '{print $3}')

if ((rotate == 90 || rotate == 270)); then
    temp=$width
    width=$height
    height=$temp
fi

if (( $(echo "$width > $height" | bc -l) )); then
    orientation="landscape"
else
    orientation="portrait"
fi

jq -n --arg width "$width" \
    --arg height "$height" \
    --arg orientation "$orientation" \
    --arg rotate "$rotate" \
    --arg pdfinfo "$info" \
    '{width: $width, height: $height, orientation: $orientation, rotate: $rotate, pdfinfo: $pdfinfo}'
