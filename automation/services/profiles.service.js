import {expect} from '@playwright/test';

export class ProfilesService {
    constructor(request, baseUrl = '') {
        this.request = request;
        this.baseUrl = baseUrl;
        this.response = null;
        this.responseBody = null;
    }

    async obterPerfil(username) {
        this.response = await this.request.get(this.endpoint(`/profiles/${username}`));
        await this.salvarResponseBody();
    }

    async seguir(username, token = null) {
        this.response = await this.request.post(this.endpoint(`/profiles/${username}/follow`), {
            headers: this.obterHeadersAutenticacao(token),
        });
        await this.salvarResponseBody();
    }

    async deixarDeSeguir(username, token = null) {
        this.response = await this.request.delete(this.endpoint(`/profiles/${username}/follow`), {
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
