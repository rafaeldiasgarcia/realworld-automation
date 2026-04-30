import {expect} from '@playwright/test';

export class HomeService {
    constructor(request) {
        this.request = request;
        this.response = null;
        this.responseBody = null;
    }

    async listarPosts() {
        this.response = await this.request.get('/articles');
        this.responseBody = await this.response.json();
    }

    async listarPostsPorTag(tag) {
        this.response = await this.request.get(`/articles?tag=${encodeURIComponent(tag)}`);
        this.responseBody = await this.response.json();
    }

    async listarFeed(token) {
        this.response = await this.request.get('/articles/feed', {
            headers: {Authorization: `Token ${token}`},
        });
        this.responseBody = await this.response.json();
    }

    async listarTags() {
        this.response = await this.request.get('/tags');
        this.responseBody = await this.response.json();
    }

    async favoritarPost(slug, token) {
        this.response = await this.request.post(`/articles/${slug}/favorite`, {
            headers: {Authorization: `Token ${token}`},
        });
        this.responseBody = await this.response.json();
    }

    async desfavoritarPost(slug, token) {
        this.response = await this.request.delete(`/articles/${slug}/favorite`, {
            headers: {Authorization: `Token ${token}`},
        });
        this.responseBody = await this.response.json();
    }

    async validarStatus(status) {
        expect(this.response.status()).toBe(status);
    }

    async validarContratoListaPosts() {
        const {articles, articlesCount} = this.responseBody;
        expect(Array.isArray(articles)).toBe(true);
        expect(typeof articlesCount).toBe('number');

        for (const article of articles) {
            expect(article).toHaveProperty('slug');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('description');
            expect(article).toHaveProperty('body');
            expect(article).toHaveProperty('tagList');
            expect(article).toHaveProperty('favoritesCount');
            expect(article).toHaveProperty('favorited');
            expect(article).toHaveProperty('author');
            expect(Array.isArray(article.tagList)).toBe(true);
            expect(typeof article.favoritesCount).toBe('number');
            expect(typeof article.favorited).toBe('boolean');
        }
    }

    async validarContratoTags() {
        const {tags} = this.responseBody;
        expect(Array.isArray(tags)).toBe(true);
        expect(tags.every(tag => typeof tag === 'string')).toBe(true);
    }

    async validarPostNaLista(postEsperado) {
        expect(this.responseBody.articles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    slug: postEsperado.slug,
                    title: postEsperado.title,
                    description: postEsperado.description,
                }),
            ]),
        );
    }

    async validarTagNaLista(tag) {
        expect(this.responseBody.tags).toContain(tag);
    }

    async validarTodosPostsPossuemTag(tag) {
        const {articles} = this.responseBody;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles.every(article => article.tagList.includes(tag))).toBe(true);
    }

    async validarTodosPostsSaoDoAutor(username) {
        const {articles} = this.responseBody;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles.every(article => article.author.username === username)).toBe(true);
    }

    async validarPostFavoritado(favoritesCount) {
        const {article} = this.responseBody;
        expect(article.favorited).toBe(true);
        expect(article.favoritesCount).toBe(favoritesCount);
    }

    async validarPostDesfavoritado(favoritesCount) {
        const {article} = this.responseBody;
        expect(article.favorited).toBe(false);
        expect(article.favoritesCount).toBe(favoritesCount);
    }
}
