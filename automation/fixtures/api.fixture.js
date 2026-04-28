import {test as base, expect} from '@playwright/test';
import {UsersService} from '../services/users.service.js';
import dadosUsers from '../tests/api/data/users.data.js';

export const test = base.extend({
    usersService: async ({request}, use) => {
        await use(new UsersService(request));
    },

    dadosUsers: async ({}, use) => {
        await use(dadosUsers);
    },
});

export {expect};
