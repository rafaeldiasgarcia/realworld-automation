import {test as base, expect} from '@playwright/test';
import {RegisterPage} from '../pages/register.page.js';
import {LoginPage} from '../pages/login.page.js';
import {HomePage} from '../pages/home.page.js';
import {NavbarPage} from '../pages/navbar.page.js';
import {ProfilePage} from '../pages/profile.page.js';
import {SettingsPage} from '../pages/settings.page.js';
import {EditorPage} from '../pages/editor.page.js';
import {ArticlePage} from '../pages/article.page.js';
import {UsersService} from '../services/users.service.js';
import {UserService} from '../services/user.service.js';
import {ArticlesService} from '../services/articles.service.js';
import {ProfilesService} from '../services/profiles.service.js';
import {criarDadosAtualizacaoUsuario, criarDadosUsuario} from '../tests/factories/users.factory.js';
import {criarComentarioArticle, criarDadosPost} from '../tests/factories/articles.factory.js';
import dadosRegister from '../tests/frontend/data/register.data.js';
import dadosLogin from '../tests/frontend/data/login.data.js';
import dadosSettings from '../tests/frontend/data/settings.data.js';
import dadosEditor from '../tests/frontend/data/editor.data.js';

const API_BASE_URL = 'http://localhost:8080';

async function criarUsuario(usersService, userService) {
    const dadosUsuario = criarDadosUsuario();
    const user = await usersService.cadastrarERetornar(dadosUsuario);
    return userService.atualizarERetornar(criarDadosAtualizacaoUsuario(dadosUsuario.username), user.token);
}

async function criarPost(articlesService, token) {
    const {dados, tag} = criarDadosPost();
    const article = await articlesService.criarERetornar(dados, token);
    return {...article, tag};
}

export const test = base.extend({
    registerPage: async ({page}, use) => {
        await use(new RegisterPage(page));
    },

    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },

    homePage: async ({page}, use) => {
        await use(new HomePage(page));
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

    editorPage: async ({page}, use) => {
        await use(new EditorPage(page));
    },

    articlePage: async ({page}, use) => {
        await use(new ArticlePage(page));
    },

    usersService: async ({request}, use) => {
        await use(new UsersService(request, API_BASE_URL));
    },

    userService: async ({request}, use) => {
        await use(new UserService(request, API_BASE_URL));
    },

    articlesService: async ({request}, use) => {
        await use(new ArticlesService(request, API_BASE_URL));
    },

    profilesService: async ({request}, use) => {
        await use(new ProfilesService(request, API_BASE_URL));
    },

    dadosSettings: async ({}, use) => {
        await use(dadosSettings);
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

    postCriado: async ({usersService, userService, articlesService}, use) => {
        const user = await criarUsuario(usersService, userService);
        const post = await criarPost(articlesService, user.token);

        await use(post);
    },

    postDoUsuarioAutenticado: async ({articlesService, contaAutenticada}, use) => {
        const post = await criarPost(articlesService, contaAutenticada.token);

        await use(post);
    },

    comentarioArticle: async ({}, use) => {
        await use(criarComentarioArticle());
    },

    postDeAutorSeguido: async ({usersService, userService, articlesService, profilesService, contaAutenticada}, use) => {
        const autor = await criarUsuario(usersService, userService);
        const post = await criarPost(articlesService, autor.token);
        await profilesService.seguir(autor.username, contaAutenticada.token);
        await profilesService.validarStatus(200);

        await use({...post, autor});
    },

    // Cria um usuário aleatório via API para testes que precisam de um segundo usuário
    outroUsuario: async ({usersService, userService}, use) => {
        const user = await criarUsuario(usersService, userService);
        await use(user);
    },

    // Cria usuário via API e injeta o token no localStorage antes de qualquer navegação
    contaAutenticada: async ({page, usersService, userService}, use) => {
        const user = await criarUsuario(usersService, userService);

        await page.addInitScript(token => {
            window.localStorage.setItem('jwtToken', token);
        }, user.token);

        await use(user);
    },
});

export {expect};
