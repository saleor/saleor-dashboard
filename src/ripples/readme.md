Ripples (name is temporary) is a feature showing a "ripple" near the important UI change. Each ripple represents some change for a user to acknowledge.

A contextual ripple shows only while its change is new to the user: to users who joined before the ripple's `dateAdded`, for 14 days after it (`RIPPLE_LIFETIME_DAYS` in `hooks/useRipplesStorage.ts`). Set `dateAdded` to the day the change ships. The What's New list keeps every ripple.
