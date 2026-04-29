import {expect} from '@playwright/test';

export class ProfilesService {
    constructor(request) {
        this.request = request;
        this.response = null;
        this.responseBody = null;
    }

    async obterPerfil(username) {
        this.response = await this.request.get(`/profiles/${username}`);
        this.responseBody = await this.response.json();
    }

    async seguir(username, token) {
        this.response = await this.request.post(`/profiles/${username}/follow`, {
            headers: {Authorization: `Token ${token}`},
        });
        this.responseBody = await this.response.json();
    }

    async deixarDeSeguir(username, token) {
        this.response = await this.request.delete(`/profiles/${username}/follow`, {
            headers: {Authorization: `Token ${token}`},
        });
        this.responseBody = await this.response.json();
    }

    async validarStatus(status) {
        expect(this.response.status()).toBe(status);
    }

    async validarContratoPerfil() {
        const {profile} = this.responseBody;
        expect(profile).toHaveProperty('username');
        expect(profile).toHaveProperty('bio');
        expect(profile).toHaveProperty('image');
        expect(profile).toHaveProperty('following');
        expect(typeof profile.username).toBe('string');
        expect(typeof profile.following).toBe('boolean');
    }

    async validarSeguindo() {
        expect(this.responseBody.profile.following).toBe(true);
    }

    async validarNaoSeguindo() {
        expect(this.responseBody.profile.following).toBe(false);
    }
}
