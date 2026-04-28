import {test as base, expect} from '@playwright/test';
import {RegisterPage} from '../pages/register.page.js';
import dadosRegister from '../tests/frontend/data/register.data.js';

export const test = base.extend({
    registerPage: async ({page}, use) => {
        await use(new RegisterPage(page));
    },

    dadosRegister: async ({}, use) => {
        await use(dadosRegister);
    },
});

export {expect};
