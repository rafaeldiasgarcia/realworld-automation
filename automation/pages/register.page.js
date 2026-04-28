import {expect} from '@playwright/test';

export class RegisterPage {
    constructor(page) {
        this.page = page;

        this.inputUsername = page.getByPlaceholder('Username');
        this.inputEmail = page.getByPlaceholder('Email');
        this.inputSenha = page.getByPlaceholder('Password');
        this.botaoSignUp = page.getByRole('button', {name: 'Sign up'});
        this.linkTemConta = page.getByRole('link', {name: 'Have an account?'});
        this.feedbackErros = page.locator('ul.error-messages');
    }

    async abrirPagina() {
        await this.page.goto('/register');
    }

    async preencherFormulario({username, email, senha}) {
        await this.inputUsername.fill(username);
        await this.inputEmail.fill(email);
        await this.inputSenha.fill(senha);
    }

    async submeter() {
        await this.botaoSignUp.click();
    }

    async cadastrar(dados) {
        await this.preencherFormulario(dados);
        await this.submeter();
    }

    async validarCadastroRealizado() {
        await this.page.waitForURL('/');
        await expect(this.page).toHaveURL('/');
    }

    async validarErroExibido() {
        await expect(this.feedbackErros).toBeVisible();
        await expect(this.page).toHaveURL('/register');
    }

    async validarBotaoDesabilitado() {
        await expect(this.botaoSignUp).toBeDisabled();
    }

    async validarRedirecionamentoParaLogin() {
        await this.linkTemConta.click();
        await expect(this.page).toHaveURL('/login');
    }
}
