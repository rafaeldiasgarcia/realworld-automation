import {expect} from '@playwright/test';

export class NavbarPage {
    constructor(page) {
        this.page = page;

        this.linkHome = page.getByRole('link', {name: 'Home'});
        this.linkSignIn = page.getByRole('link', {name: 'Sign in'});
        this.linkSignUp = page.getByRole('link', {name: 'Sign up'});
        this.linkNewArticle = page.getByRole('link', {name: 'New Article'});
        this.linkSettings = page.getByRole('link', {name: 'Settings'});
        this.loader = page.getByText('Loading...');
    }

    async aguardarNavbar() {
        await this.loader.waitFor({state: 'hidden'});
    }

    async validarNavbarNaoAutenticado() {
        await this.aguardarNavbar();
        await expect(this.linkSignIn).toBeVisible();
        await expect(this.linkSignUp).toBeVisible();
        await expect(this.linkNewArticle).not.toBeVisible();
        await expect(this.linkSettings).not.toBeVisible();
    }

    async validarNavbarAutenticado(username) {
        await this.aguardarNavbar();
        await expect(this.linkNewArticle).toBeVisible();
        await expect(this.linkSettings).toBeVisible();
        await expect(this.page.getByRole('link', {name: username})).toBeVisible();
        await expect(this.linkSignIn).not.toBeVisible();
        await expect(this.linkSignUp).not.toBeVisible();
    }
}
