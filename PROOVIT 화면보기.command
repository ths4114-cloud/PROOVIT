#!/bin/zsh

set -u
setopt NO_BG_NICE

PROJECT_DIR="${0:A:h}"
APP_URL="http://127.0.0.1:3000/preview"
BACKEND_URL="http://127.0.0.1:54329/health"
PREVIEW_CACHE="$PROJECT_DIR/.preview-cache/npm"

cd "$PROJECT_DIR" || exit 1
mkdir -p "$PREVIEW_CACHE"

cleanup() {
  if [[ -n "${APP_PID:-}" ]]; then kill "$APP_PID" 2>/dev/null || true; fi
  if [[ -n "${BACKEND_PID:-}" ]]; then kill "$BACKEND_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM

clear
print ""
print "  PROOVIT 화면을 준비하고 있습니다."
print "  처음 한 번은 필요한 파일을 받아서 1~3분 정도 걸릴 수 있어요."
print ""

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  open "$PROJECT_DIR/PROOVIT 화면 미리보기.png"
  print "  우선 완성된 화면 이미지를 열었습니다."
  print "  움직이는 앱을 실행하려면 https://nodejs.org 의 LTS 버전이 필요합니다."
  print ""
  read "?  Enter를 누르면 창이 닫힙니다. "
  exit 1
fi

if [[ ! -d node_modules ]]; then
  print "  필요한 파일을 설치하는 중입니다…"
  if ! npm ci --cache "$PREVIEW_CACHE"; then
    print ""
    print "  설치하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 실행해 주세요."
    read "?  Enter를 누르면 창이 닫힙니다. "
    exit 1
  fi
fi

if curl --silent --fail "http://127.0.0.1:3000" >/dev/null 2>&1 || \
   curl --silent --fail "$BACKEND_URL" >/dev/null 2>&1; then
  print "  이미 실행 중인 개발 화면이 있습니다."
  print "  기존 터미널의 미리보기를 종료한 뒤 다시 더블클릭해 주세요."
  read "?  Enter를 누르면 창이 닫힙니다. "
  exit 1
fi

node tests/e2e/backend.mjs >"$PROJECT_DIR/.preview-cache/backend.log" 2>&1 &
BACKEND_PID=$!

BACKEND_READY=false
for attempt in {1..60}; do
  if curl --silent --fail "$BACKEND_URL" >/dev/null 2>&1; then
    BACKEND_READY=true
    break
  fi
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    print "  미리보기 데이터를 준비하지 못했습니다."
    print "  다른 PROOVIT 미리보기 창을 닫고 다시 실행해 주세요."
    read "?  Enter를 누르면 창이 닫힙니다. "
    exit 1
  fi
  sleep 1
done

if [[ "$BACKEND_READY" != "true" ]]; then
  print "  미리보기 데이터 준비 시간이 너무 오래 걸렸습니다. 다시 시도해 주세요."
  read "?  Enter를 누르면 창이 닫힙니다. "
  exit 1
fi

NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54329" \
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_local-preview-key" \
APP_ORIGIN="http://127.0.0.1:3000" \
PROOVIT_CHALLENGE_SLUG="launch-31" \
PROOVIT_LOCAL_PREVIEW="true" \
npm run dev -- --hostname 127.0.0.1 >"$PROJECT_DIR/.preview-cache/app.log" 2>&1 &
APP_PID=$!

for attempt in {1..90}; do
  if curl --silent --fail "http://127.0.0.1:3000" >/dev/null 2>&1; then
    open "$APP_URL"
    print ""
    print "  화면을 열었습니다. 브라우저에서 확인하세요."
    print "  미리보기를 끝낼 때 이 창으로 돌아와 Enter를 누르세요."
    print ""
    read "?  Enter를 누르면 미리보기가 종료됩니다. "
    exit 0
  fi
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    print "  화면을 실행하지 못했습니다."
    print "  다른 개발 서버를 종료한 뒤 다시 실행해 주세요."
    print "  자세한 내용: .preview-cache/app.log"
    read "?  Enter를 누르면 창이 닫힙니다. "
    exit 1
  fi
  sleep 1
done

print "  실행 시간이 너무 오래 걸렸습니다. 다시 시도해 주세요."
read "?  Enter를 누르면 창이 닫힙니다. "
exit 1
