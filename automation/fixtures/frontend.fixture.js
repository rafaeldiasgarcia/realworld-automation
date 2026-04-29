import {test as base, expect} from '@playwright/test';
import {RegisterPage} from '../pages/register.page.js';
import {LoginPage} from '../pages/login.page.js';
import {NavbarPage} from '../pages/navbar.page.js';
import {ProfilePage} from '../pages/profile.page.js';
import dadosRegister from '../tests/frontend/data/register.data.js';
import dadosLogin from '../tests/frontend/data/login.data.js';

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

    dadosRegister: async ({}, use) => {
        await use(dadosRegister);
    },

    dadosLogin: async ({}, use) => {
        await use(dadosLogin);
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
