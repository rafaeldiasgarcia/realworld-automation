import {test as base, expect} from '@playwright/test';
import {RegisterPage} from '../pages/register.page.js';

export const test = base.extend({
    registerPage: async ({page}, use) => {
        await use(new RegisterPage(page));
    },
});

export {expect};
