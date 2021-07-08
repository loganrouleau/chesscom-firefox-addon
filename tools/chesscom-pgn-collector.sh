#!/bin/bash

# This is a standalone tool to download PGN games for a specified Chess.com user.

[ $# -eq 0 ] && echo "Provide a Chess.com username" && exit 1;

rm result.txt

for year in {2020..2021}
do
    for month in 01 02 03 04 05 06 07 08 09 10 11 12
    do
        curl --location --request GET "https://api.chess.com/pub/player/$1/games/$year/$month/pgn" \
        --header 'Content-Type: application/x-chess-pgn' \
        --header 'Content-Disposition: attachment; filename="ChessCom_username_YYYYMM.pgn"' >> result.txt
    done
done
