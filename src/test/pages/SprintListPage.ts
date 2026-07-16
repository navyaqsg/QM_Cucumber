import { Page, Locator, expect } from '@playwright/test';

export class SprintListPage {
  constructor(private page: Page) {}

  private readonly selectors = {
    userStoriesNavLinkName: 'User Stories',
    sprintsButtonNameRegex: /^Sprints/i,
    switchSprintDialogTitle: 'Switch Sprint',
    sprintWithStoriesText: 'Sprint12',
    addStoryButtonName: 'Add Story',
    loadingSprintsText: 'Loading sprints...',
    qaSprintName: 'QA Sprint',
  };

  private get userStoriesNavLink(): Locator {
    return this.page.getByRole('link', { name: this.selectors.userStoriesNavLinkName });
  }

  private get sprintsSelectorButton(): Locator {
    return this.page.getByRole('button', { name: this.selectors.sprintsButtonNameRegex }).first();
  }

  private get switchSprintDialog(): Locator {
    return this.page.getByRole('dialog');
  }

  private get addStoryButton(): Locator {
    return this.page.getByRole('button', { name: this.selectors.addStoryButtonName });
  }

  private get loadingSprintsText(): Locator {
    return this.page.getByText(this.selectors.loadingSprintsText);
  }

  async goto(): Promise<void> {
    const baseUrl = process.env.BASE_URL || '';
    await this.page.goto(`${baseUrl}/user-stories`, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/user-stories/);
  }

  async ensureOnSprintListPage(): Promise<void> {
    // In this app, Sprint selection is done from the User Stories page top bar.
    await this.userStoriesNavLink.waitFor({ state: 'visible' });
  }

  async openSprintSwitcher(): Promise<void> {
    await this.sprintsSelectorButton.click();
    await expect(this.switchSprintDialog).toBeVisible();
    await expect(this.switchSprintDialog).toContainText(this.selectors.switchSprintDialogTitle);
  }

  async selectSprintThatHasStories(): Promise<void> {
    // The sprint list may take time to load (dialog shows "Loading sprints...").
    // Wait for loading text to disappear before searching for sprint entries.
    await this.loadingSprintsText.waitFor({ state: 'hidden', timeout: 30_000 }).catch(async () => {
      // If it never hides, capture dialog text for debugging.
      const dialogText = (await this.switchSprintDialog.textContent().catch(() => '')) || '';
      throw new Error(`Sprint list did not finish loading. Dialog text: ${dialogText.trim().slice(0, 200)}`);
    });

    // Snapshot shows a sprint entry containing "Sprint12" and "13 stories".
    const sprintButton = this.switchSprintDialog
      .getByRole('button')
      .filter({ hasText: this.selectors.sprintWithStoriesText })
      .first();

    await expect(sprintButton).toBeVisible({ timeout: 30_000 });
    await sprintButton.click();
  }

  async assertLoadingIndicatorVisibleImmediately(): Promise<void> {
    // App under test did not expose a stable accessible loading indicator in snapshots.
    // This assertion is intentionally strict and will fail until a visible loader is present.
    const loader = this.page.getByText('Loading user stories...');
    await expect(loader).toBeVisible();
  }

  async assertAddStoryNotVisibleDuringLoading(): Promise<void> {
    await expect(this.addStoryButton).toBeHidden();
  }

  async assertUserStoriesDisplayedCorrectly(): Promise<void> {
    // Validate that the User Stories selector is present and at least one story exists.
    const userStoriesSelector = this.page.getByRole('button', { name: /^User Stories/i }).first();
    await expect(userStoriesSelector).toBeVisible();

    await userStoriesSelector.click();
    const dialog = this.page.getByRole('dialog');
    const firstStory = dialog.getByRole('button').filter({ hasText: 'HRM-' }).first();
    await expect(firstStory).toBeVisible();
    await this.page.keyboard.press('Escape');
  }

  async openSprintByName(name: string): Promise<void> {
    await this.openSprintSwitcher();

    // The dialog can remain in a "Loading sprints..." state in some environments.
    // If it does, we still attempt to click the sprint by name once it appears.
    // (This keeps the test resilient while still validating the Sprint view loading state.)
    await this.loadingSprintsText.waitFor({ state: 'hidden', timeout: 60_000 }).catch(async () => {
      // Continue even if loading text never hides.
    });

    // Sprint entries are rendered as buttons inside the "Switch Sprint" dialog.
    const sprintButton = this.switchSprintDialog.getByRole('button').filter({ hasText: name }).first();
    await expect(sprintButton).toBeVisible({ timeout: 60_000 });
    await sprintButton.click();
  }

  async assertLoadingIndicatorNotVisibleAfterRender(): Promise<void> {
    const loader = this.page.getByText('Loading user stories...');
    await expect(loader).toBeHidden();
  }
}
