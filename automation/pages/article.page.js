import {expect} from '@playwright/test';

export class ArticlePage {
    constructor(page) {
        this.page = page;

        this.titulo = page.locator('.article-page .banner h1');
        this.conteudo = page.locator('.article-content');
        this.areaComentarios = page.locator('.article-page .col-xs-12.col-md-8.offset-md-2');
        this.linkSignIn = this.areaComentarios.getByRole('link', {name: 'Sign in'});
        this.linkSignUp = this.areaComentarios.getByRole('link', {name: 'sign up'});
        this.inputComentario = page.getByPlaceholder('Write a comment...');
        this.botaoPostComment = page.getByRole('button', {name: 'Post Comment'});
        this.botaoEditArticle = page.getByRole('link', {name: 'Edit Article'}).first();
        this.botaoDeleteArticle = page.getByRole('button', {name: 'Delete Article'}).first();
        this.botaoFavoriteArticle = page.getByRole('button', {name: /Favorite Article/}).first();
        this.botaoUnfavoriteArticle = page.getByRole('button', {name: /Unfavorite Article/}).first();
        this.botaoFollow = page.getByRole('button', {name: /Follow/}).first();
        this.botaoUnfollow = page.getByRole('button', {name: /Unfollow/}).first();

        // CSS justificado: tags, comentários e lixeira são estruturas renderizadas sem roles semânticos únicos.
        this.tags = page.locator('.article-content .tag-list li.tag-outline');
        this.comentarios = page.locator('app-article-comment .card');
        this.botaoExcluirComentario = page.locator('app-article-comment .mod-options .ion-trash-a').first();
    }

    async abrirPagina(post) {
        await this.page.goto(`/article/${post.slug}`);
    }

    async validarDetalhesDoPost(post) {
        await expect(this.titulo).toHaveText(post.title);
        await expect(this.conteudo).toContainText(post.body.split('\n')[0]);
        await expect(this.tags.filter({hasText: post.tag})).toBeVisible();
        await expect(this.page.getByRole('link', {name: post.author.username}).first()).toBeVisible();
    }

    async validarPromptComentarioVisitante() {
        await expect(this.linkSignIn).toBeVisible();
        await expect(this.linkSignUp).toBeVisible();
        await expect(this.inputComentario).not.toBeVisible();
        await expect(this.botaoPostComment).not.toBeVisible();
    }

    async validarAcoesDeAutor() {
        await expect(this.botaoEditArticle).toBeVisible();
        await expect(this.botaoDeleteArticle).toBeVisible();
        await expect(this.botaoFollow).not.toBeVisible();
        await expect(this.botaoFavoriteArticle).not.toBeVisible();
    }

    async validarAcoesDeLeitor(post) {
        await expect(this.botaoFollow).toContainText(post.author.username);
        await expect(this.botaoFavoriteArticle).toContainText('(0)');
        await expect(this.botaoEditArticle).not.toBeVisible();
        await expect(this.botaoDeleteArticle).not.toBeVisible();
    }

    async navegarParaEdicao() {
        await this.botaoEditArticle.click();
        await expect(this.page).toHaveURL(/\/editor\/.+/);
    }

    async deletarPost() {
        await this.botaoDeleteArticle.click();
    }

    async validarPostDeletado() {
        await expect(this.page).toHaveURL('/');
    }

    async favoritarPost() {
        await this.botaoFavoriteArticle.click();
    }

    async validarPostFavoritado() {
        await expect(this.botaoUnfavoriteArticle).toContainText('(1)');
    }

    async desfavoritarPost() {
        await this.botaoUnfavoriteArticle.click();
    }

    async validarPostDesfavoritado() {
        await expect(this.botaoFavoriteArticle).toContainText('(0)');
    }

    async seguirAutor() {
        await this.botaoFollow.click();
    }

    async validarAutorSeguido() {
        await expect(this.botaoUnfollow).toBeVisible();
    }

    async deixarDeSeguirAutor() {
        await this.botaoUnfollow.click();
    }

    async validarAutorNaoSeguido() {
        await expect(this.botaoFollow).toBeVisible();
    }

    async comentar(comentario) {
        await this.inputComentario.fill(comentario);
        await this.botaoPostComment.click();
    }

    async validarComentarioExibido(comentario) {
        await expect(this.comentarios.filter({hasText: comentario})).toBeVisible();
        await expect(this.inputComentario).toHaveValue('');
    }

    async excluirComentario() {
        await this.botaoExcluirComentario.click();
    }

    async validarComentarioRemovido(comentario) {
        await expect(this.comentarios.filter({hasText: comentario})).not.toBeVisible();
    }
}
