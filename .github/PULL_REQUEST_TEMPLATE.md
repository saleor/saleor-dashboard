<!-- Title: Describe the change in plain words (e.g. "Fix adding variants to an order" or "Simplify test setup"). The title and description should explain the full scope without requiring reviewers to read the diff. -->

## Proof

<!--
Show that the change works and how it works.
Required when users can see or interact with the change. Capture it from the running Dashboard against a real Saleor API, not mocks or Storybook.

Pick the format that fits the change:
- Video: anything with motion or steps (a flow, interaction, loading, animation, transition). Record the whole path from start to the final result. Leave out Saleor login and all the prep-work.
- Screenshot: static changes (layout, copy, styles). Show before and after at the same viewport.

Embed media inline so it plays in the PR. Avoid long stacks of artifacts (e.g. 5 screenshots). Remove this section only when the change has no user-visible effect.
-->

## What was done

<!-- Describe the changes in simple English, covering every area this PR touches. Use visual explanation (such as a state chart or diagram) as aid to explain complex changes. -->

## Why

<!-- Explain what was wrong or missing, and for whom. -->

## Decisions

<!-- Explain non-obvious trade-offs, rejected alternatives, and follow-ups left out. Remove this section if none apply. -->

## Testing

<!-- Describe how you verified the change. -->

## Related issue

<!-- Link related issues, discussions, or stacked PRs. For new features, link the approved GitHub issue. -->

<!-- Check only completed items. Leave non-applicable items unchecked. -->

- [ ] I added a changeset for a user-facing feature, enhancement, or bug fix.
- [ ] I added a Ripple for new user-facing functionality (see `src/ripples`).
- [ ] I used analytics `trackEvent` for key interactions and outcomes of a substantial product feature.

<!-- PRs that do not follow this template may be automatically rejected. -->
