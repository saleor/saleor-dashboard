---
"saleor-dashboard": patch
---

Prevent the What's New modal from repeatedly sending PostHog events after storage updates. Each opening now sends a single event.
