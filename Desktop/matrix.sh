#!/bin/bash
# Matrix rain - run this in your terminal
trap 'tput sgr0; clear; exit' INT TERM

cols=$(tput cols)
rows=$(tput lines)
chars='ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヰ ヱ ヲ ン 0 1 2 3 4 5 6 7 8 9'

tput civis
clear

declare -a drops
for ((i=0; i<cols; i+=2)); do
  drops[$i]=$((RANDOM % rows))
done

while true; do
  for ((i=0; i<cols; i+=2)); do
    x=${drops[$i]}

    # Draw head (bright white)
    printf "\033[%d;%dH\033[1;97m%s" "$x" "$i" "$(echo $chars | tr ' ' '\n' | shuf -n1)"

    # Draw body (green)
    if ((x > 1)); then
      printf "\033[%d;%dH\033[1;32m%s" "$((x-1))" "$i" "$(echo $chars | tr ' ' '\n' | shuf -n1)"
    fi
    if ((x > 3)); then
      printf "\033[%d;%dH\033[0;32m%s" "$((x-2))" "$i" "$(echo $chars | tr ' ' '\n' | shuf -n1)"
    fi

    # Erase tail
    if ((x > 6)); then
      printf "\033[%d;%dH " "$((x-5))" "$i"
    fi

    # Advance
    drops[$i]=$(( (x + 1) % (rows + 5) ))

    if ((drops[$i] >= rows)); then
      drops[$i]=0
    fi
  done
  sleep 0.05
done
