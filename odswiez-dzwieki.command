#!/bin/bash
# Mantra Box: odświeża listę dźwięków z folderu „dzwieki”.
# Kliknij ten plik dwa razy po wrzuceniu nowych plików WAV / MP3.
cd "$(dirname "$0")/dzwieki" || exit 1
shopt -s nullglob nocaseglob
{
  echo '// Ten plik tworzy się sam: wrzuć pliki WAV/MP3 do folderu „dzwieki”'
  echo '// i kliknij dwa razy „odswiez-dzwieki.command”.'
  echo 'window.MOJE_DZWIEKI = ['
  for f in *.wav *.mp3 *.m4a *.aif *.aiff *.ogg *.flac; do
    printf '  "%s",\n' "$(printf '%s' "$f" | sed 's/\\/\\\\/g; s/"/\\"/g')"
  done
  echo '];'
} > lista.js
echo
echo "Gotowe! Dźwięki w folderze „dzwieki”:"
grep '^  "' lista.js || echo "  (brak plików — wrzuć tu pliki WAV lub MP3)"
echo
echo "Odśwież stronę Mantra Box w przeglądarce (Cmd+R). To okno możesz zamknąć."
