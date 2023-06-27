# Changeset

## Writing guidelines

### Rules:

#### 1. Avoid repetition when describing bug fixes

Bad:

> Fixed a bug where the component fired confetti uncontrollably when typing into the input. Fixed a bug when...

Good:

> The input no longer fires confetti on typing.

#### 2. Use more personal tone

Bad:

> It is now possible to use the class xyz directly in…

Good:

> **You can now** use the class xyz directly in…

#### 3. Make it about the user, not the code

Bad:

> Added the X and Y fields to the schema returned by Z.

Good:

> You can now see how many users are connected to a deployment (_X_), and the users capacity of the deployment (_Y_).

#### 4. Use a minimal amount of fluff

Bad:

> After many long nights at the office, several cans of beer, and consuming the amount of pizza equal to the surface of a helipad, we finally managed to squash a bug that’s been haunting you forever. Its origin reaches back to the times when Tim Berners-Lee…

Good:

> The application no longer shuts down when attempting to abort a payment.

#### 5. Use a template when lost

If you don’t have an idea how to start, you may use some of those openings:

- “You can now…”
- “X no longer does Y when Z.”
- “X no longer does Y. This means you no longer need to Z.”

#### 6. Describe known issues

When the release introduces some issues or limitations, describe them:

> You may experience issues when trying to use the new view with an Adblock turned on. The issue will be fixed in the next release. For now, please…

### Resources

- https://www.youtube.com/watch?v=L3yAD319DiU
- https://keepachangelog.com/en/1.0.0/
