import {test as base, expect} from '@playwright/test';
import {RegisterPage} from '../pages/register.page.js';
import {LoginPage} from '../pages/login.page.js';
import dadosRegister from '../tests/frontend/data/register.data.js';
import dadosLogin from '../tests/frontend/data/login.data.js';

export const test = base.extend({
    registerPage: async ({page}, use) => {
        await use(new RegisterPage(page));
    },

    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },

    dadosRegister: async ({}, use) => {
        await use(dadosRegister);
    },

    dadosLogin: async ({}, use) => {
        await use(dadosLogin);
    },
});

export {expect};
