import {expect} from '@playwright/test';

export class EditorPage {
    constructor(page) {
        this.page = page;

        this.inputTitulo = page.getByPlaceholder('Article Title');
        this.inputDescricao = page.getByPlaceholder("What's this article about?");
        this.inputCorpo = page.getByPlaceholder('Write your article (in markdown)');
        this.inputTags = page.getByPlaceholder('Enter tags');
        this.botaoPublicar = page.getByRole('button', {name: 'Publish Article'});
        this.feedbackErros = page.locator('.error-messages');
    }

    async abrirPagina() {
        await this.page.goto('/editor');
    }

    async preencherFormulario(dados) {
        await this.inputTitulo.fill(dados.titulo);
        await this.inputDescricao.fill(dados.descricao);
        await this.inputCorpo.fill(dados.corpo);
        if (dados.tags) {
            await this.inputTags.fill(dados.tags);
            await this.inputTags.press('Enter');
        }
    }

    async publicarArtigo() {
        await this.botaoPublicar.click();
    }

    async validarArtigoPublicado() {
        await expect(this.page).toHaveURL(/\/article\/.+/);
    }

    async validarBotaoDesabilitado() {
        await expect(this.botaoPublicar).toBeDisabled();
    }

    async validarErroExibido() {
        await expect(this.feedbackErros).toBeVisible();
        await expect(this.page).toHaveURL('/editor');
    }
}
