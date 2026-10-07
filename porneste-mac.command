#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nu este instalat. Descarcă versiunea LTS de pe https://nodejs.org și rulează din nou."
  open https://nodejs.org
  exit 1
fi
[ -d node_modules ] || { echo "Instalez dependențele (doar prima dată, 1-2 minute)..."; npm install; }
echo "Cesarini pornește pe http://localhost:3000 (Ctrl+C ca să oprești)"
( sleep 4 && open http://localhost:3000 ) &
npm run dev
