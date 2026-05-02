#!/usr/bin/env bash
# Usage: ./doorbell.sh "sender-name" ["optional message"]
# Env:   DOORBELL_WEBHOOK_URL — Discord webhook URL

set -euo pipefail

NAME="${1:?Usage: doorbell.sh <name> [message]}"
MESSAGE="${2:-}"
WEBHOOK="${DOORBELL_WEBHOOK_URL:?DOORBELL_WEBHOOK_URL is not set}"

if [ -z "$MESSAGE" ]; then
  CONTENT="$NAME is at the door!"
else
  CONTENT="$NAME: $MESSAGE"
fi

curl -sf -X POST "$WEBHOOK" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"$CONTENT\"}"
