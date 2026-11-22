---
"saleor-dashboard": patch
---

A widget's resize request now changes only that widget's frame. Before, every frame from the same app reacted to it, so an open popup from that app could shrink to the widget's height.
