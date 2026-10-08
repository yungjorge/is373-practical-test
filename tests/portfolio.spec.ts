import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/about",
  "/work",
  "/work/campus-compass",
  "/work/independent-press",
  "/work/everyday-objects",
  "/learn",
  "/learn/design-styles",
  "/learn/persuasion",
  "/learn/archetypes",
  "/studio",
];

test("all pages and local illustrations load without browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          img.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
  }
  expect(errors).toEqual([]);
  expect((await page.goto("/work/missing-project"))?.status()).toBe(404);
});

test("themes persist through navigation, reload, and synchronize across tabs", async ({
  page,
  context,
}) => {
  await page.goto("/studio");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "systems");
  await page.getByRole("button", { name: /Swiss Precise/ }).click();
  await expect(page.getByLabel("Color and design theme")).toHaveValue("swiss");
  await page.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "swiss");
  await page.reload();
  await expect(page.getByLabel("Color and design theme")).toHaveValue("swiss");
  const second = await context.newPage();
  await second.goto("/");
  await second.getByLabel("Color and design theme").selectOption("punk");
  await expect(page.getByLabel("Color and design theme")).toHaveValue("punk");
  await page.getByLabel("Color and design theme").selectOption("base");
  await expect(second.locator("html")).toHaveAttribute("data-theme", "base");
});

test("invalid stored theme falls back and switching works without storage", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("is373-theme", "not-a-theme"),
  );
  await page.goto("/");
  await expect(page.getByLabel("Color and design theme")).toHaveValue(
    "systems",
  );
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  });
  await page.reload();
  await page.getByLabel("Color and design theme").selectOption("swiss");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "swiss");
});

test("history filters and brand brief reflect student choices", async ({
  page,
}) => {
  await page.goto("/learn/design-styles");
  await expect(page.locator(".style-entry")).toHaveCount(10);
  await page.getByRole("button", { name: "Reactions & experiments" }).click();
  await expect(page.locator(".style-entry")).toHaveCount(4);
  await expect(
    page.getByRole("heading", { name: "New Wave / Swiss Punk" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".style-entry")).toHaveCount(10);
  await page.goto("/learn/archetypes");
  await page.getByLabel("Primary archetype").selectOption("Sage");
  await page.getByLabel("Who do you want to reach?").fill("a research team");
  await page
    .getByLabel("What real project supports this promise?")
    .fill("My campus interview study");
  await expect(page.locator(".brief-preview")).toContainText("a research team");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download your brief" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("portfolio-brand-brief.txt");
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString()).toContain(
    "My campus interview study",
  );
});

for (const theme of ["systems", "brutalist", "base", "swiss", "punk"]) {
  test(`${theme}: responsive layout and accessible page controls`, async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Color and design theme").selectOption(theme);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of [
        "/",
        "/about",
        "/work",
        "/studio",
        "/learn/design-styles",
        "/learn/archetypes",
      ]) {
        await page.goto(route);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${theme} ${route} at ${width}`,
        ).toBe(true);
      }
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const route of [
      "/",
      "/about",
      "/work",
      "/studio",
      "/learn/archetypes",
      "/learn/persuasion",
    ]) {
      await page.goto(route);
      const accessibility = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(accessibility.violations, `${theme} ${route}`).toEqual([]);
    }
  });
}

test("skip link is reachable by keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("professional navigation leads to real summaries and separates course examples", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "JORGESANCHEZ.",
  );
  await page.getByRole("link", { name: /01.*Freight Estimator API/ }).click();
  await expect(page).toHaveURL(/\/work#freight-estimator$/);
  await expect(page.locator("#freight-estimator")).toContainText(
    "Sole developer",
  );
  await expect(page.locator("#freight-estimator")).toContainText(
    "pending review",
  );
  await page.getByRole("link", { name: "Skills", exact: true }).click();
  await expect(page).toHaveURL(/\/#skills$/);
  await expect(
    page.getByRole("heading", {
      name: "Different tools. One connected picture.",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("#contact")).toContainText(
    "Contact details will be available here soon.",
  );
  await page.getByRole("link", { name: /IS373 field guide/ }).click();
  await expect(page).toHaveURL(/\/learn$/);
});
