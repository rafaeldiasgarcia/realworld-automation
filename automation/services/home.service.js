import {expect} from '@playwright/test';

export class HomeService {
    constructor(request, baseUrl = '') {
        this.request = request;
        this.baseUrl = baseUrl;
        this.response = null;
        this.responseBody = null;
    }

    async listarPosts(token = null) {
        this.response = await this.request.get(this.endpoint('/articles'), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async listarPostsPorTag(tag, token = null) {
        await this.listarPostsComFiltros({tag}, token);
    }

    async listarPostsPorAutor(username, token = null) {
        await this.listarPostsComFiltros({author: username}, token);
    }

    async listarPostsFavoritadosPor(username, token = null) {
        await this.listarPostsComFiltros({favorited: username}, token);
    }

    async listarPostsPaginados({limit, offset}, token = null) {
        await this.listarPostsComFiltros({limit, offset}, token);
    }

    async listarPostsComFiltros(filtros, token = null) {
        const params = new URLSearchParams();
        for (const [chave, valor] of Object.entries(filtros)) {
            if (valor !== undefined && valor !== null) {
                params.set(chave, String(valor));
            }
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/articles?${queryString}` : '/articles';

        this.response = await this.request.get(this.endpoint(endpoint), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async listarFeed(token = null) {
        this.response = await this.request.get(this.endpoint('/articles/feed'), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async listarTags() {
        this.response = await this.request.get(this.endpoint('/tags'));
        await this.salvarResponseBody();
    }

    async favoritarPost(slug, token = null) {
        this.response = await this.request.post(this.endpoint(`/articles/${slug}/favorite`), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async desfavoritarPost(slug, token = null) {
        this.response = await this.request.delete(this.endpoint(`/articles/${slug}/favorite`), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    endpoint(path) {
        return `${this.baseUrl}${path}`;
    }

    obterHeadersAutenticacao(token) {
        return token ? {Authorization: `Token ${token}`} : {};
    }

    async salvarResponseBody() {
        const texto = await this.response.text();
        try {
            this.responseBody = texto ? JSON.parse(texto) : null;
        } catch {
            this.responseBody = null;
        }
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

    async validarTodosPostsFavoritados() {
        const {articles} = this.responseBody;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles.every(article => article.favorited === true)).toBe(true);
    }

    async validarLimiteRespeitado(limit) {
        expect(this.responseBody.articles.length).toBeLessThanOrEqual(limit);
    }

    async validarQuantidadeTotalMaiorOuIgualA(quantidade) {
        expect(this.responseBody.articlesCount).toBeGreaterThanOrEqual(quantidade);
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
