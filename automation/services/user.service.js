import {expect} from '@playwright/test';

export class UserService {
    constructor(request, baseUrl = '') {
        this.request = request;
        this.baseUrl = baseUrl;
        this.response = null;
        this.responseBody = null;
    }

    async obter(token = null) {
        this.response = await this.request.get(this.endpoint('/user'), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async atualizar(dados, token = null) {
        this.response = await this.request.put(this.endpoint('/user'), {
            headers: this.obterHeadersAutenticacao(token),
            data: {user: dados},
        });
        await this.salvarResponseBody();
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

    endpoint(path) {
        return `${this.baseUrl}${path}`;
    }

    async atualizarERetornar(dados, token) {
        await this.atualizar(dados, token);
        if (!this.response.ok()) {
            throw new Error(`Falha ao atualizar usuário para teste: ${this.response.status()}`);
        }

        return this.responseBody.user;
    }

    async validarStatus(status) {
        expect(this.response.status()).toBe(status);
    }

    async validarContratoUser() {
        const {user} = this.responseBody;
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('token');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('bio');
        expect(user).toHaveProperty('image');
        expect(typeof user.email).toBe('string');
        expect(typeof user.username).toBe('string');
    }

    async validarErroNoCampo(campo) {
        const {errors} = this.responseBody;
        expect(errors).toHaveProperty(campo);
    }
}
