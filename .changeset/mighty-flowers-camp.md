---
"saleor-dashboard": patch
---

Fixed the feedback button staying hidden even when its survey loaded successfully. The button now appears when feedback is available, including surveys configured to match the feedback button, and stays hidden in production when surveys are blocked or unavailable. Local development continues to show the feedback button without analytics configuration.
