import {expect} from '@playwright/test';

export class UsersService {
    constructor(request, baseUrl = '') {
        this.request = request;
        this.baseUrl = baseUrl;
        this.response = null;
        this.responseBody = null;
    }

    async cadastrar(dados) {
        this.response = await this.request.post(this.endpoint('/users'), {
            data: {user: dados},
        });
        this.responseBody = await this.response.json();
    }

    endpoint(path) {
        return `${this.baseUrl}${path}`;
    }

    async cadastrarERetornar(dados) {
        await this.cadastrar(dados);
        if (!this.response.ok()) {
            throw new Error(`Falha ao criar usuário para teste: ${this.response.status()}`);
        }

        return this.responseBody.user;
    }

    async validarStatus(statusEsperado) {
        expect(this.response.status()).toBe(statusEsperado);
    }

    async validarContratoUser() {
        expect(this.responseBody.user).toBeDefined();
        expect(this.responseBody.user.email).toBeDefined();
        expect(this.responseBody.user.username).toBeDefined();
        expect(this.responseBody.user.token).toBeDefined();
        expect(this.responseBody.user.bio).toBeDefined();
        expect(this.responseBody.user.image).toBeDefined();
    }

    async validarErroNoCampo(campo) {
        expect(this.responseBody.errors).toBeDefined();
        expect(this.responseBody.errors[campo]).toBeDefined();
    }
}
