import { AxeBuilder } from "@axe-core/playwright";

import { expect, test } from "../fixtures/test.js";

test("authenticated store has no serious accessibility violations", async ({
  page,
  authenticatedStore,
}) => {
  await expect(authenticatedStore.heading).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const serious = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );
  expect(serious).toEqual([]);
});
