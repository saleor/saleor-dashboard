---
"saleor-dashboard": patch
---

Product edit now makes the save model clearer: the save bar lists unsaved areas (details, channels, variants), Media notes that uploads save immediately, Availability shows when channel listings are dirty, leaving the page explains that media and metadata are already saved, and partial save failures show which steps applied. Save stays disabled until something actually differs from the saved product; reverting a field clears the unsaved hint, and a failed save keeps the draft so merchants can retry.
