import {test as base, expect} from '@playwright/test';
import {UsersService} from '../services/users.service.js';
import {UsersLoginService} from '../services/users-login.service.js';
import {ProfilesService} from '../services/profiles.service.js';
import {UserService} from '../services/user.service.js';
import {ArticlesService} from '../services/articles.service.js';
import {HomeService} from '../services/home.service.js';
import {criarDadosUsuario} from '../tests/factories/users.factory.js';
import {criarDadosPost} from '../tests/factories/articles.factory.js';
import dadosRegister from '../tests/api/users/data/register.data.js';
import dadosLogin from '../tests/api/users/data/login.data.js';
import dadosUser from '../tests/api/user/data/user.data.js';
import dadosArticles from '../tests/api/articles/data/articles.data.js';

async function criarUsuario(usersService) {
    return usersService.cadastrarERetornar(criarDadosUsuario());
}

async function criarPost(articlesService, token) {
    const {dados, tag} = criarDadosPost();
    const article = await articlesService.criarERetornar(dados, token);
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

    usernameInexistente: async ({}, use) => {
        await use(criarDadosUsuario().username);
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

    // Cria usuário via API para contexto autenticado puro de API
    contaAutenticada: async ({usersService}, use) => {
        const user = await criarUsuario(usersService);
        await use(user);
    },

    // Cria um usuário aleatório via API para testes que precisam de um segundo usuário
    outroUsuario: async ({usersService}, use) => {
        const user = await criarUsuario(usersService);
        await use(user);
    },

    postCriado: async ({usersService, articlesService}, use) => {
        const user = await criarUsuario(usersService);
        const post = await criarPost(articlesService, user.token);
        await use(post);
    },

    postDoUsuarioAutenticado: async ({articlesService, contaAutenticada}, use) => {
        const post = await criarPost(articlesService, contaAutenticada.token);
        await use(post);
    },

    postDeAutorSeguido: async ({usersService, articlesService, profilesService, contaAutenticada}, use) => {
        const autor = await criarUsuario(usersService);
        const post = await criarPost(articlesService, autor.token);
        await profilesService.seguir(autor.username, contaAutenticada.token);
        await profilesService.validarStatus(200);

        await use({...post, autor});
    },

    postFavoritado: async ({usersService, articlesService, homeService, contaAutenticada}, use) => {
        const autor = await criarUsuario(usersService);
        const post = await criarPost(articlesService, autor.token);
        await homeService.favoritarPost(post.slug, contaAutenticada.token);
        await homeService.validarStatus(200);

        await use(post);
    },

    postsParaPaginacao: async ({usersService, articlesService}, use) => {
        const autor = await criarUsuario(usersService);
        const primeiroPost = await criarPost(articlesService, autor.token);
        const segundoPost = await criarPost(articlesService, autor.token);

        await use([primeiroPost, segundoPost]);
    },

    comentarioDeOutroUsuario: async ({usersService, articlesService, dadosArticles}, use) => {
        const autor = await criarUsuario(usersService);
        const comentarista = await criarUsuario(usersService);
        const post = await criarPost(articlesService, autor.token);

        await articlesService.comentar(post.slug, dadosArticles.comentario, comentarista.token);
        await articlesService.validarStatus(201);

        await use({
            post,
            comentarista,
            comentario: dadosArticles.comentario,
            comentarioId: articlesService.comentarioId,
        });
    },
});

export {expect};
