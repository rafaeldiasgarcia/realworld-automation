import {test as base, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {UsersService} from '../services/users.service.js';
import {UsersLoginService} from '../services/users-login.service.js';
import {ProfilesService} from '../services/profiles.service.js';
import {UserService} from '../services/user.service.js';
import {ArticlesService} from '../services/articles.service.js';
import {HomeService} from '../services/home.service.js';
import dadosRegister from '../tests/api/users/data/register.data.js';
import dadosLogin from '../tests/api/users/data/login.data.js';
import dadosUser from '../tests/api/user/data/user.data.js';
import dadosArticles from '../tests/api/articles/data/articles.data.js';

const SENHA_PADRAO = 'Test@1234';

function gerarDadosUsuario() {
    const username = `test${faker.string.alphanumeric(8).toLowerCase()}`;
    return {
        username,
        email: `${username}@example.com`,
        password: SENHA_PADRAO,
    };
}

async function criarUsuario(request) {
    const response = await request.post('/users', {
        data: {user: gerarDadosUsuario()},
    });
    if (!response.ok()) {
        throw new Error(`Falha ao criar usuário para teste: ${response.status()}`);
    }
    const {user} = await response.json();

    return user;
}

async function criarPost(request, token) {
    const tag = `tag-${faker.string.alphanumeric(8).toLowerCase()}`;
    const dadosPost = {
        title: `Artigo ${faker.string.alphanumeric(10)}`,
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
        tagList: [tag],
    };
    const response = await request.post('/articles', {
        headers: {Authorization: `Token ${token}`},
        data: {article: dadosPost},
    });
    if (!response.ok()) {
        throw new Error(`Falha ao criar post para teste: ${response.status()}`);
    }
    const {article} = await response.json();

    return {...article, tag};
}

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

    articlesService: async ({request}, use) => {
        await use(new ArticlesService(request));
    },

    homeService: async ({request}, use) => {
        await use(new HomeService(request));
    },

    dadosUser: async ({}, use) => {
        await use(dadosUser);
    },

    dadosArticles: async ({}, use) => {
        await use(dadosArticles);
    },

    dadosRegister: async ({}, use) => {
        await use(dadosRegister);
    },

    dadosLogin: async ({}, use) => {
        await use(dadosLogin);
    },

    // Login via API — sem injeção de page (contexto API puro)
    contaAutenticada: async ({request}, use) => {
        const user = await criarUsuario(request);
        await use(user);
    },

    // Cria um usuário aleatório via API para testes que precisam de um segundo usuário
    outroUsuario: async ({request}, use) => {
        const user = await criarUsuario(request);
        await use(user);
    },

    postCriado: async ({request}, use) => {
        const user = await criarUsuario(request);
        const post = await criarPost(request, user.token);
        await use(post);
    },

    postDeAutorSeguido: async ({request, contaAutenticada}, use) => {
        const autor = await criarUsuario(request);
        const post = await criarPost(request, autor.token);
        const response = await request.post(`/profiles/${autor.username}/follow`, {
            headers: {Authorization: `Token ${contaAutenticada.token}`},
        });
        if (!response.ok()) {
            throw new Error(`Falha ao seguir autor para teste: ${response.status()}`);
        }

        await use({...post, autor});
    },
});

export {expect};
