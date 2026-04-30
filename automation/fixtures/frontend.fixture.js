import {test as base, expect} from '@playwright/test';
import {faker} from '@faker-js/faker';
import {RegisterPage} from '../pages/register.page.js';
import {LoginPage} from '../pages/login.page.js';
import {HomePage} from '../pages/home.page.js';
import {NavbarPage} from '../pages/navbar.page.js';
import {ProfilePage} from '../pages/profile.page.js';
import {SettingsPage} from '../pages/settings.page.js';
import {EditorPage} from '../pages/editor.page.js';
import dadosRegister from '../tests/frontend/data/register.data.js';
import dadosLogin from '../tests/frontend/data/login.data.js';
import dadosSettings from '../tests/frontend/data/settings.data.js';
import dadosEditor from '../tests/frontend/data/editor.data.js';

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
    const dadosUsuario = gerarDadosUsuario();
    const response = await request.post('http://localhost:8080/users', {
        data: {user: dadosUsuario},
    });
    if (!response.ok()) {
        throw new Error(`Falha ao criar usuário para teste: ${response.status()}`);
    }
    const {user} = await response.json();

    const updateResponse = await request.put('http://localhost:8080/user', {
        headers: {Authorization: `Token ${user.token}`},
        data: {user: {
            bio: faker.lorem.sentence(),
            image: `https://i.pravatar.cc/150?u=${dadosUsuario.username}`,
        }},
    });
    if (!updateResponse.ok()) {
        throw new Error(`Falha ao atualizar usuário para teste: ${updateResponse.status()}`);
    }
    const {user: usuarioAtualizado} = await updateResponse.json();

    return usuarioAtualizado;
}

async function criarPost(request, token) {
    const tag = `tag-${faker.string.alphanumeric(8).toLowerCase()}`;
    const dadosArtigo = {
        title: `Artigo ${faker.string.alphanumeric(10)}`,
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
        tagList: [tag],
    };

    const response = await request.post('http://localhost:8080/articles', {
        headers: {Authorization: `Token ${token}`},
        data: {article: dadosArtigo},
    });
    if (!response.ok()) {
        throw new Error(`Falha ao criar post para teste da Home: ${response.status()}`);
    }
    const {article} = await response.json();

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

    dadosSettings: async ({}, use) => {
        await use(dadosSettings);
    },

    editorPage: async ({page}, use) => {
        await use(new EditorPage(page));
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

    postCriado: async ({request}, use) => {
        const user = await criarUsuario(request);
        const post = await criarPost(request, user.token);

        await use(post);
    },

    postDeAutorSeguido: async ({request, contaAutenticada}, use) => {
        const autor = await criarUsuario(request);
        const post = await criarPost(request, autor.token);
        const response = await request.post(`http://localhost:8080/profiles/${autor.username}/follow`, {
            headers: {Authorization: `Token ${contaAutenticada.token}`},
        });
        if (!response.ok()) {
            throw new Error(`Falha ao seguir autor para teste da Home: ${response.status()}`);
        }

        await use({...post, autor});
    },

    // Cria um usuário aleatório via API para testes que precisam de um segundo usuário
    outroUsuario: async ({request}, use) => {
        const user = await criarUsuario(request);
        await use(user);
    },

    // Loga via API e injeta o token no localStorage antes de qualquer navegação
    contaAutenticada: async ({page, request}, use) => {
        const user = await criarUsuario(request);

        await page.addInitScript(token => {
            window.localStorage.setItem('jwtToken', token);
        }, user.token);

        await use(user);
    },
});

export {expect};
