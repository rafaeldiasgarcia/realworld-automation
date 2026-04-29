import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Profile', {tag: ['@frontend']}, () => {

    test('deve exibir dados do perfil do usuário autenticado', {tag: ['@smoke']}, async ({profilePage, contaAutenticada}) => {
        await profilePage.abrirPagina(contaAutenticada.username);
        await profilePage.validarDadosDoPerfil(contaAutenticada.username);
    });

    test('deve exibir botão de editar perfil no próprio perfil', {tag: ['@regressao']}, async ({profilePage, contaAutenticada}) => {
        await profilePage.abrirPagina(contaAutenticada.username);
        await profilePage.validarBotaoEditarPerfilVisivel();
    });

    test('deve exibir abas de posts no perfil', {tag: ['@regressao']}, async ({profilePage, contaAutenticada}) => {
        await profilePage.abrirPagina(contaAutenticada.username);
        await profilePage.validarAbasPresentes();
    });

    test('deve navegar para aba de posts favoritos', {tag: ['@regressao']}, async ({profilePage, contaAutenticada}) => {
        await profilePage.abrirPagina(contaAutenticada.username);
        await profilePage.navegarParaPostsFavoritos();
    });
});
