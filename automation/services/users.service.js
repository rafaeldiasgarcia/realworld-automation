import {expect} from '@playwright/test';

export class UsersService {
    constructor(request) {
        this.request = request;
        this.response = null;
        this.responseBody = null;
    }

    async cadastrar(dados) {
        this.response = await this.request.post('/users', {
            data: {user: dados},
        });
        this.responseBody = await this.response.json();
    }

    async logar(dados) {
        this.response = await this.request.post('/users/login', {
            data: {user: dados},
        });
        this.responseBody = await this.response.json();
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
