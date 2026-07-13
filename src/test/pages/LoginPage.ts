import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private readonly selectors = {
    emailInput: '#email',
    passwordInput: '#password',
    signInButtonRoleName: 'Sign In',
    selectClientDialogTitle: 'Select Client',
    clientComboboxRole: 'combobox',
    confirmButtonRoleName: 'Confirm',
  };

  private get emailField(): Locator {
    return this.page.locator(this.selectors.emailInput);
  }

  private get passwordField(): Locator {
    return this.page.locator(this.selectors.passwordInput);
  }

  private get signInButton(): Locator {
    return this.page.getByRole('button', { name: this.selectors.signInButtonRoleName });
  }

  private get selectClientDialog(): Locator {
    return this.page.getByRole('dialog');
  }

  private get clientCombobox(): Locator {
    return this.page.getByRole(this.selectors.clientComboboxRole as any);
  }

  private get confirmButton(): Locator {
    return this.page.getByRole('button', { name: this.selectors.confirmButtonRoleName });
  }

  async goto(): Promise<void> {
    const baseUrl = process.env.BASE_URL || '';
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/login/);
  }

  async loginWithEnvCredentials(): Promise<void> {
    const username = process.env.TEST_USERNAME || process.env.APP_USERNAME;
    const password = process.env.TEST_PASSWORD || process.env.APP_PASSWORD;

    if (!username || !password) {
      throw new Error('Missing credentials. Set TEST_USERNAME/TEST_PASSWORD (or APP_USERNAME/APP_PASSWORD).');
    }

    await this.emailField.fill(username);
    await this.passwordField.fill(password);
    await this.signInButton.click();
  }

  async selectClient(clientName: string): Promise<void> {
    await expect(this.selectClientDialog).toBeVisible();
    await expect(this.selectClientDialog).toContainText(this.selectors.selectClientDialogTitle);

    await this.clientCombobox.selectOption(clientName);
    await this.confirmButton.click();
  }
}
