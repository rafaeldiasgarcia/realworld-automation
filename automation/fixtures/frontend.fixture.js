import {test as base, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {RegisterPage} from '../pages/register.page.js';
import {LoginPage} from '../pages/login.page.js';
import {NavbarPage} from '../pages/navbar.page.js';
import {ProfilePage} from '../pages/profile.page.js';
import {SettingsPage} from '../pages/settings.page.js';
import {EditorPage} from '../pages/editor.page.js';
import dadosRegister from '../tests/frontend/data/register.data.js';
import dadosLogin from '../tests/frontend/data/login.data.js';
import dadosSettings from '../tests/frontend/data/settings.data.js';
import dadosEditor from '../tests/frontend/data/editor.data.js';

export const test = base.extend({
    registerPage: async ({page}, use) => {
        await use(new RegisterPage(page));
    },

    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },

    navbarPage: async ({page}, use) => {
        await use(new NavbarPage(page));
    },

    profilePage: async ({page}, use) => {
        await use(new ProfilePage(page));
    },

    settingsPage: async ({page}, use) => {
        await use(new SettingsPage(page));
    },

    dadosSettings: async ({}, use) => {
        await use(dadosSettings);
    },

    editorPage: async ({page}, use) => {
        await use(new EditorPage(page));
    },

    dadosEditor: async ({}, use) => {
        await use(dadosEditor);
    },

    dadosRegister: async ({}, use) => {
        await use(dadosRegister);
    },

    dadosLogin: async ({}, use) => {
        await use(dadosLogin);
    },

    // Cria um usuário aleatório via API para testes que precisam de um segundo usuário
    outroUsuario: async ({request}, use) => {
        const username = `test${faker.string.alphanumeric(8)}`;
        const response = await request.post('http://localhost:8080/users', {
            data: {user: {username, email: faker.internet.email(), password: 'Test@1234'}},
        });
        const {user} = await response.json();
        await use(user);
    },

    // Loga via API e injeta o token no localStorage antes de qualquer navegação
    contaAutenticada: async ({page, request}, use) => {
        const response = await request.post('http://localhost:8080/users/login', {
            data: {user: {email: 'rafael@conduit.com', password: 'Test@1234'}},
        });
        const {user} = await response.json();

        await page.addInitScript(token => {
            window.localStorage.setItem('jwtToken', token);
        }, user.token);

        await use(user);
    },
});

export {expect};
