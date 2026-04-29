import {test as base, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {UsersService} from '../services/users.service.js';
import {UsersLoginService} from '../services/users-login.service.js';
import {ProfilesService} from '../services/profiles.service.js';
import {UserService} from '../services/user.service.js';
import dadosRegister from '../tests/api/users/data/register.data.js';
import dadosLogin from '../tests/api/users/data/login.data.js';
import dadosUser from '../tests/api/user/data/user.data.js';

export const test = base.extend({
    usersService: async ({request}, use) => {
        await use(new UsersService(request));
    },

    usersLoginService: async ({request}, use) => {
        await use(new UsersLoginService(request));
    },

    profilesService: async ({request}, use) => {
        await use(new ProfilesService(request));
    },

    userService: async ({request}, use) => {
        await use(new UserService(request));
    },

    dadosUser: async ({}, use) => {
        await use(dadosUser);
    },

    dadosRegister: async ({}, use) => {
        await use(dadosRegister);
    },

    dadosLogin: async ({}, use) => {
        await use(dadosLogin);
    },

    // Login via API — sem injeção de page (contexto API puro)
    contaAutenticada: async ({request}, use) => {
        const response = await request.post('/users/login', {
            data: {user: {email: 'rafael@conduit.com', password: 'Test@1234'}},
        });
        const {user} = await response.json();
        await use(user);
    },

    // Cria um usuário aleatório via API para testes que precisam de um segundo usuário
    outroUsuario: async ({request}, use) => {
        const username = `test${faker.string.alphanumeric(8)}`;
        const response = await request.post('/users', {
            data: {user: {username, email: faker.internet.email(), password: 'Test@1234'}},
        });
        const {user} = await response.json();
        await use(user);
    },
});

export {expect};
