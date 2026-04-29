import {expect} from '@playwright/test';

export class ArticlesService {
    constructor(request) {
        this.request = request;
        this.response = null;
        this.responseBody = null;
    }

    async criar(dados, token) {
        this.response = await this.request.post('/articles', {
            headers: {Authorization: `Token ${token}`},
            data: {article: dados},
        });
        this.responseBody = await this.response.json();
    }

    async validarStatus(status) {
        expect(this.response.status()).toBe(status);
    }

    async validarContratoArtigo() {
        const {article} = this.responseBody;
        expect(article).toHaveProperty('slug');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('description');
        expect(article).toHaveProperty('body');
        expect(article).toHaveProperty('tagList');
        expect(article).toHaveProperty('author');
        expect(typeof article.slug).toBe('string');
        expect(typeof article.title).toBe('string');
        expect(Array.isArray(article.tagList)).toBe(true);
    }

    async validarErroNoCampo(campo) {
        const {errors} = this.responseBody;
        expect(errors).toHaveProperty(campo);
    }
}
