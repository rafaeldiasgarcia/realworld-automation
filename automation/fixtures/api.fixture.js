import {test as base, expect} from '@playwright/test';
import {UsersService} from '../services/users.service.js';
import {UsersLoginService} from '../services/users-login.service.js';
import dadosRegister from '../tests/api/users/data/register.data.js';
import dadosLogin from '../tests/api/users/data/login.data.js';

export const test = base.extend({
    usersService: async ({request}, use) => {
        await use(new UsersService(request));
    },

    usersLoginService: async ({request}, use) => {
        await use(new UsersLoginService(request));
    },

    dadosRegister: async ({}, use) => {
        await use(dadosRegister);
    },

    dadosLogin: async ({}, use) => {
        await use(dadosLogin);
    },
});

export {expect};
