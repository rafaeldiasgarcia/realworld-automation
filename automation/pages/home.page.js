import {expect} from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;

        this.linkYourFeed = page.getByRole('link', {name: 'Your Feed'});
        this.linkGlobalFeed = page.getByRole('link', {name: 'Global Feed'});
        this.linkTagAtiva = page.locator('.feed-toggle .nav-link.active');
        this.iconeTagAtiva = page.locator('.feed-toggle .nav-link.active .ion-pound');
        this.loaderArtigos = page.getByText('Loading articles...');
        this.loaderTags = page.getByText('Loading tags...');

        // CSS justificado: artigos e tags sao listas renderizadas sem roles semanticos especificos.
        this.artigos = page.locator('app-article-preview');
        this.listaTagsPopulares = page.locator('.sidebar .tag-list');
        this.tagsPopulares = this.listaTagsPopulares.getByRole('link');
        this.botaoPrimeiroFavorito = page.locator('app-article-preview app-favorite-button button').first();
        this.linkPrimeiroArtigo = page.locator('app-article-preview .preview-link').first();
    }

    async abrirPagina() {
        await this.page.goto('/');
    }

    async abrirFeedSeguindo() {
        await this.page.goto('/?feed=following');
    }

    async aguardarCarregamento() {
        await this.loaderArtigos.waitFor({state: 'hidden'});
        await this.loaderTags.waitFor({state: 'hidden'});
    }

    async validarFeedGlobalVisivel(artigo) {
        await this.aguardarCarregamento();
        await expect(this.linkGlobalFeed).toHaveClass(/active/);
        await this.validarPostVisivel(artigo);
    }

    async validarTagsPopulares(artigo) {
        await this.aguardarCarregamento();
        await expect(this.tagsPopulares.filter({hasText: artigo.tag})).toBeVisible();
    }

    async validarAbasDeVisitante() {
        await this.aguardarCarregamento();
        await expect(this.linkGlobalFeed).toBeVisible();
        await expect(this.linkGlobalFeed).toHaveClass(/active/);
        await expect(this.linkYourFeed).not.toBeVisible();
    }

    async validarAbasDeUsuarioAutenticado() {
        await this.aguardarCarregamento();
        await expect(this.linkYourFeed).toBeVisible();
        await expect(this.linkGlobalFeed).toBeVisible();
        await expect(this.linkGlobalFeed).toHaveClass(/active/);
    }

    async validarFeedSeguindoVisivel(post) {
        await this.aguardarCarregamento();
        await expect(this.linkYourFeed).toHaveClass(/active/);
        await this.validarPostVisivel(post);
    }

    async filtrarPorTagPopular(tag) {
        await this.tagsPopulares.filter({hasText: tag}).click();
    }

    async validarFiltroPorTagPopular(artigo) {
        await this.aguardarCarregamento();
        await expect(this.page).toHaveURL(`/tag/${artigo.tag}`);
        await expect(this.iconeTagAtiva).toBeVisible();
        await expect(this.linkTagAtiva).toContainText(artigo.tag);
        await this.validarPostVisivel(artigo);

        const quantidadeArtigos = await this.artigos.count();
        expect(quantidadeArtigos).toBeGreaterThan(0);

        const todosArtigosPossuemTag = await this.artigos.evaluateAll((artigos, tag) => artigos.every(artigoPreview => {
            const tags = Array.from(artigoPreview.querySelectorAll('.preview-link .tag-list li.tag-outline'));
            return tags.some(tagItem => tagItem.textContent.trim() === tag);
        }), artigo.tag);
        expect(todosArtigosPossuemTag).toBe(true);
    }

    async validarPostVisivel(post) {
        const postPreview = this.artigos.filter({hasText: post.title});
        await expect(postPreview).toBeVisible();
        await expect(postPreview.getByRole('heading', {name: post.title})).toBeVisible();
        await expect(postPreview.getByText(post.description)).toBeVisible();
    }

    async favoritarPost(post) {
        const postPreview = this.artigos.filter({hasText: post.title});
        await postPreview.locator('app-favorite-button button').click();
    }

    async validarQuantidadeFavoritosDoPost(post, quantidade) {
        const postPreview = this.artigos.filter({hasText: post.title});
        await expect(postPreview.locator('app-favorite-button button')).toContainText(String(quantidade));
    }

    async favoritarPrimeiroArtigo() {
        await this.botaoPrimeiroFavorito.click();
    }

    async validarVisitanteRedirecionadoParaCadastro() {
        await expect(this.page).toHaveURL('/register');
    }

    async abrirPrimeiroArtigo() {
        await this.linkPrimeiroArtigo.click();
    }

    async validarArtigoAberto() {
        await expect(this.page).toHaveURL(/\/article\/.+/);
    }

    async validarRedirecionamentoParaLogin() {
        await expect(this.page).toHaveURL('/login');
    }
}
