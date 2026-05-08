import {expect} from '@playwright/test';

export class ArticlesService {
    constructor(request, baseUrl = '') {
        this.request = request;
        this.baseUrl = baseUrl;
        this.response = null;
        this.responseBody = null;
        this.comentarioId = null;
    }

    async criar(dados, token = null) {
        this.response = await this.request.post(this.endpoint('/articles'), {
            headers: this.obterHeadersAutenticacao(token),
            data: {article: dados},
        });
        await this.salvarResponseBody();
    }

    async criarERetornar(dados, token) {
        await this.criar(dados, token);
        if (!this.response.ok()) {
            throw new Error(`Falha ao criar post para teste: ${this.response.status()}`);
        }

        return this.responseBody.article;
    }

    async obter(slug, token = null) {
        this.response = await this.request.get(this.endpoint(`/articles/${slug}`), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async atualizar(slug, dados, token = null) {
        this.response = await this.request.put(this.endpoint(`/articles/${slug}`), {
            headers: this.obterHeadersAutenticacao(token),
            data: {article: dados},
        });
        await this.salvarResponseBody();
    }

    async deletar(slug, token = null) {
        this.response = await this.request.delete(this.endpoint(`/articles/${slug}`), {
            headers: this.obterHeadersAutenticacao(token),
        });
        this.responseBody = null;
    }

    async listarComentarios(slug, token = null) {
        this.response = await this.request.get(this.endpoint(`/articles/${slug}/comments`), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async comentar(slug, dados, token = null) {
        this.response = await this.request.post(this.endpoint(`/articles/${slug}/comments`), {
            headers: this.obterHeadersAutenticacao(token),
            data: {comment: dados},
        });
        await this.salvarResponseBody();
        this.comentarioId = this.responseBody?.comment?.id;
    }

    async deletarComentario(slug, token = null) {
        await this.deletarComentarioPorId(slug, this.comentarioId, token);
    }

    async deletarComentarioPorId(slug, comentarioId, token = null) {
        this.response = await this.request.delete(this.endpoint(`/articles/${slug}/comments/${comentarioId}`), {
            headers: this.obterHeadersAutenticacao(token),
        });
        this.responseBody = null;
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

    async validarTagListDoArtigo(tagsEsperadas) {
        expect(this.responseBody.article.tagList).toEqual(tagsEsperadas);
    }

    async validarDadosDoArtigo(artigoEsperado) {
        const {article} = this.responseBody;
        expect(article.slug).toBe(artigoEsperado.slug);
        expect(article.title).toBe(artigoEsperado.title);
        expect(article.description).toBe(artigoEsperado.description);
        expect(article.body).toBe(artigoEsperado.body);
    }

    async validarArtigoAtualizado(dadosAtualizados) {
        const {article} = this.responseBody;
        expect(article.title).toBe(dadosAtualizados.title);
        expect(article.description).toBe(dadosAtualizados.description);
        expect(article.body).toBe(dadosAtualizados.body);
    }

    async validarContratoComentarios() {
        const {comments} = this.responseBody;
        expect(Array.isArray(comments)).toBe(true);

        for (const comment of comments) {
            expect(comment).toHaveProperty('id');
            expect(comment).toHaveProperty('body');
            expect(comment).toHaveProperty('createdAt');
            expect(comment).toHaveProperty('updatedAt');
            expect(comment).toHaveProperty('author');
            expect(typeof comment.body).toBe('string');
            expect(comment.author).toHaveProperty('username');
            expect(comment.author).toHaveProperty('following');
        }
    }

    async validarContratoComentario() {
        const {comment} = this.responseBody;
        expect(comment).toHaveProperty('id');
        expect(comment).toHaveProperty('body');
        expect(comment).toHaveProperty('createdAt');
        expect(comment).toHaveProperty('updatedAt');
        expect(comment).toHaveProperty('author');
        expect(typeof comment.id).toBe('string');
        expect(typeof comment.body).toBe('string');
        expect(comment.author).toHaveProperty('username');
        expect(comment.author).toHaveProperty('following');
    }

    async validarComentarioCriado(dadosComentario) {
        expect(this.responseBody.comment.body).toBe(dadosComentario.body);
    }

    async validarAutorDoComentario(username) {
        expect(this.responseBody.comment.author.username).toBe(username);
    }

    async validarComentarioNaLista(dadosComentario) {
        expect(this.responseBody.comments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    body: dadosComentario.body,
                }),
            ]),
        );
    }

    async validarComentarioAusente(dadosComentario) {
        expect(this.responseBody.comments).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    body: dadosComentario.body,
                }),
            ]),
        );
    }

    async validarErroNoCampo(campo) {
        const {errors} = this.responseBody;
        expect(errors).toHaveProperty(campo);
    }
}
