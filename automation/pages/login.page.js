import {expect} from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;

        this.inputEmail = page.getByPlaceholder('Email');
        this.inputSenha = page.getByPlaceholder('Password');
        this.botaoSignIn = page.getByRole('button', {name: 'Sign in'});
        this.linkPrecisaDeConta = page.getByRole('link', {name: 'Need an account?'});
        this.feedbackErros = page.locator('ul.error-messages');
    }

    async abrirPagina() {
        await this.page.goto('/login');
    }

    async preencherFormulario({email, senha}) {
        await this.inputEmail.fill(email);
        await this.inputSenha.fill(senha);
    }

    async submeter() {
        await this.botaoSignIn.click();
    }

    async logar(dados) {
        await this.preencherFormulario(dados);
        await this.submeter();
    }

    async validarLoginRealizado() {
        await this.page.waitForURL('/');
        await expect(this.page).toHaveURL('/');
    }

    async validarErroExibido() {
        await expect(this.feedbackErros).toBeVisible();
        await expect(this.page).toHaveURL('/login');
    }

    async validarBotaoDesabilitado() {
        await expect(this.botaoSignIn).toBeDisabled();
    }

    async validarRedirecionamentoParaCadastro() {
        await this.linkPrecisaDeConta.click();
        await expect(this.page).toHaveURL('/register');
    }
}
