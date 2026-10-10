# usage: passes.sh behind|front|caps ...   (pass files are generated, rendered, then removed)
cd "$(dirname "$0")"
for k in "$@"; do
  python3 -c "
s=open('index.html').read()
hide={'behind':'.front,.caps','front':'.behind,.caps','caps':'.behind,.front'}['$k']
open('pass_$k.html','w').write(s.replace('</style>',hide+'{display:none!important}\n</style>',1))"
  rm -rf renders/$k
  npx hyperframes@0.8.134 render -c pass_$k.html --fps 30 --quality draft --format png-sequence --workers 2 --no-low-memory-mode --protocol-timeout 900000 -o renders/$k > renders/pass_$k.log 2>&1
  if grep -q "Render failed" renders/pass_$k.log; then
    rm -rf renders/$k
    npx hyperframes@0.8.134 render -c pass_$k.html --fps 30 --quality draft --format png-sequence --protocol-timeout 900000 -o renders/$k > renders/pass_$k.log 2>&1
  fi
  rm -f pass_$k.html
  echo "$k frames=$(ls renders/$k 2>/dev/null | wc -l | tr -d ' ')"
done
