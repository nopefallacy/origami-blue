# usage: cardlayers.sh <project> <comma-times>   -> <project>/cards/layers/{behind,front}_{black,white}/frame-*.png
P=$1; T=$2
cd "$P"
for layer in behind front; do
  for bg in black white; do
    d=cards/layers/${layer}_${bg}; rm -rf $d; mkdir -p $d/proj
    ln -s ../../../../fonts $d/proj/fonts; ln -s ../../../../media $d/proj/media
    hide=$([ $layer = behind ] && echo ".front,.caps,#grain" || echo ".behind,.caps,#grain")
    col=$([ $bg = black ] && echo "#000" || echo "#fff")
    python3 -c "
s=open('index.html').read()
open('$d/proj/index.html','w').write(s.replace('</style>','$hide{display:none!important} html,body,#root{background:$col!important}\n</style>',1))"
    npx hyperframes@0.8.134 snapshot $d/proj --at $T --no-end --describe false --timeout 30000 -o $PWD/$d >/dev/null 2>&1
    echo "$layer/$bg: $(ls $d/*.png 2>/dev/null | wc -l | tr -d ' ')"
  done
done
