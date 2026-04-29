import {expect} from '@playwright/test';

export class UserService {
    constructor(request) {
        this.request = request;
        this.response = null;
        this.responseBody = null;
    }

    async obter(token) {
        this.response = await this.request.get('/user', {
            headers: {Authorization: `Token ${token}`},
        });
        this.responseBody = await this.response.json();
    }

    async atualizar(dados, token) {
        this.response = await this.request.put('/user', {
            headers: {Authorization: `Token ${token}`},
            data: {user: dados},
        });
        this.responseBody = await this.response.json();
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
