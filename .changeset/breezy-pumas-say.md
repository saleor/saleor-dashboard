---
"saleor-dashboard": patch
---

Fixed debugging messages (warnings in browser console) where Dashboard confused actions from 3rd party, like browser extensions signals with AppBridge actions. Now warnings should only occur, when proper frame is sent, but with invalid events inside
