# Error Tracking

Tonserve Dashboard uses a generic error-tracking wrapper function that takes care of the most popular use cases:

- initializing the tracker
- capturing exceptions and (optionally) displaying the event id
- setting basic user data (this is opt-in and disabled by default)

By default, it ships with a Sentry adapter, but you can use any error-tracking software by creating a custom adapter (using Sentry and TS types as an example).

Example:

```javascript
// src/services/errorTracking/index.ts

import { CustomAdapter } from "./adapters/";

const errorTracker = ErrorTrackerFactory(CustomAdapter(config));
```
