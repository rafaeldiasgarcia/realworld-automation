import {expect} from '@playwright/test';

export class ProfilePage {
    constructor(page) {
        this.page = page;

        // CSS justificado: img do perfil não tem role semântico único — .user-img é a classe estável do Conduit
        this.fotoPerfil = page.locator('img.user-img');
        this.bio = page.locator('.user-info p');
        this.botaoEditarPerfil = page.getByRole('link', {name: 'Edit Profile Settings'});
        this.abaMyPosts = page.getByRole('link', {name: 'My Posts'});
        this.abaFavoritedPosts = page.getByRole('link', {name: 'Favorited Posts'});
    }

    async abrirPagina(username) {
        await this.page.goto(`/profile/${username}`);
    }

    async validarDadosDoPerfil(username) {
        await expect(this.page.getByRole('heading', {name: username})).toBeVisible();
        await expect(this.fotoPerfil).toBeVisible();
        await expect(this.bio).toBeVisible();
    }

    async validarBotaoEditarPerfilVisivel() {
        await expect(this.botaoEditarPerfil).toBeVisible();
    }

    async validarAbasPresentes() {
        await expect(this.abaMyPosts).toBeVisible();
        await expect(this.abaFavoritedPosts).toBeVisible();
    }

    async navegarParaPostsFavoritos() {
        await this.abaFavoritedPosts.click();
        await expect(this.page).toHaveURL(/\/profile\/.+\/favorites$/);
    }
}
