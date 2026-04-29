import {expect} from '@playwright/test';

export class SettingsPage {
    constructor(page) {
        this.page = page;

        this.inputFoto = page.getByPlaceholder('URL of profile picture');
        this.inputUsername = page.getByRole('textbox', {name: 'Username'});
        this.inputBio = page.getByPlaceholder('Short bio about you');
        this.inputEmail = page.getByPlaceholder('Email');
        this.inputSenha = page.getByPlaceholder('New Password');
        this.botaoAtualizar = page.getByRole('button', {name: 'Update Settings'});
        this.botaoLogout = page.getByRole('button', {name: 'Or click here to logout.'});
        this.feedbackErros = page.locator('.error-messages');
    }

    async abrirPagina() {
        await this.page.goto('/settings');
    }

    async validarFormularioPreenchido(username, email) {
        await expect(this.inputUsername).toHaveValue(username);
        await expect(this.inputEmail).toHaveValue(email);
    }

    async atualizarBio(bio) {
        await this.inputBio.clear();
        await this.inputBio.fill(bio);
        await this.botaoAtualizar.click();
    }

    async validarAtualizacaoRealizada(username) {
        await expect(this.page).toHaveURL(`/profile/${username}`);
    }

    async salvarComCampoVazio(campo) {
        await campo.clear();
        await this.botaoAtualizar.click();
    }

    async validarErroExibido() {
        await expect(this.feedbackErros).toBeVisible();
        await expect(this.page).toHaveURL('/settings');
    }

    async realizarLogout() {
        await this.botaoLogout.click();
    }

    async validarLogoutRealizado() {
        await expect(this.page).toHaveURL('/');
    }
}
