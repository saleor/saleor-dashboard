import { recurse } from "cypress-recurse";
import pixelmatch from "pixelmatch";

export function ensureCanvasStatic(selector = "canvas") {
  cy.log(`ensure the image in **${selector}** is static`);
  const noLog = { log: false };

  const delay = 300; // ms, when grabbing new image

  // take the current image
  return cy
    .get(selector, noLog)
    .then($canvas => {
      const ctx1 = $canvas[0].getContext("2d");
      const width = $canvas[0].width;
      const height = $canvas[0].height;
      let img1 = ctx1.getImageData(0, 0, width, height);

      // initial delay to make sure we catch updates
      cy.wait(delay, noLog);

      return recurse(
        () =>
          cy.get(selector, noLog).then($canvas => {
            const ctx2 = $canvas[0].getContext("2d");
            const img2 = ctx2.getImageData(0, 0, width, height);

            const diff = ctx2.createImageData(width, height);
            // number of different pixels
            const number = pixelmatch(
              img1.data,
              img2.data,
              diff.data,
              width,
              height,
              {
                threshold: 0.1,
              },
            );

            // for next comparison, use the new image
            // as the base - this way we can get to the end
            // of any animation
            img1 = img2;

            return number;
          }),
        // predicate function
        numberOfDifferentPixels => numberOfDifferentPixels < 10,
        // recurse options
        {
          // by default uses the default command timeout
          log: numberOfDifferentPixels =>
            cy.log(`**${numberOfDifferentPixels}** diff pixels`),
          delay,
        },
      );
    })
    .then(() => {
      cy.log(`picture in **${selector}** is static`);
    });
}
