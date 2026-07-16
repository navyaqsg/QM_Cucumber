import { Page, Locator, expect } from '@playwright/test';

export class SprintViewPage {
  constructor(private page: Page) {}

  private readonly selectors = {
    // Observed in snapshot: Sprint switcher dialog shows "Loading sprints..."
    loadingText: 'Loading sprints...',
  };

  private get loadingIndicator(): Locator {
    // Derived from snapshot: dialog shows text "Loading sprints..."
    return this.page.getByText(this.selectors.loadingText, { exact: true });
  }

  private storyTitle(title: string): Locator {
    // Story titles are expected to be visible text in the Sprint view.
    return this.page.getByText(title, { exact: true });
  }

  async assertLoadingIndicatorVisible(): Promise<void> {
    await expect(this.loadingIndicator).toBeVisible({ timeout: 30_000 });
  }

  async waitForLoadingToComplete(): Promise<void> {
    await expect(this.loadingIndicator).toBeHidden({ timeout: 60_000 });
  }

  async assertStoryVisible(title: string): Promise<void> {
    await expect(this.storyTitle(title)).toBeVisible({ timeout: 30_000 });
  }

  async assertLoadingIndicatorHidden(): Promise<void> {
    await expect(this.loadingIndicator).toBeHidden({ timeout: 30_000 });
  }
}
