import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Settings', {tag: ['@frontend']}, () => {

    test('deve exibir formulário com dados do usuário autenticado', {tag: ['@smoke']}, async ({settingsPage, contaAutenticada}) => {
        await settingsPage.abrirPagina();
        await settingsPage.validarFormularioPreenchido(contaAutenticada.username, contaAutenticada.email);
    });

    test('deve atualizar bio com sucesso', {tag: ['@regressao']}, async ({settingsPage, contaAutenticada, dadosSettings}) => {
        await settingsPage.abrirPagina();
        await settingsPage.atualizarBio(dadosSettings.atualizacao.bio);
        await settingsPage.validarAtualizacaoRealizada(contaAutenticada.username);
    });

   test('deve exibir erro ao tentar salvar com username vazio', {tag: ['@regressao', '@negativo']}, async ({settingsPage, contaAutenticada}) => {
        await settingsPage.abrirPagina();
        await settingsPage.salvarComCampoVazio(settingsPage.inputUsername);
        await settingsPage.validarErroExibido();
    });

    test('deve exibir erro ao tentar salvar com email vazio', {tag: ['@regressao', '@negativo']}, async ({settingsPage, contaAutenticada}) => {
        await settingsPage.abrirPagina();
        await settingsPage.salvarComCampoVazio(settingsPage.inputEmail);
        await settingsPage.validarErroExibido();
    });

    test('deve realizar logout com sucesso', {tag: ['@regressao']}, async ({settingsPage, navbarPage, contaAutenticada}) => {
        await settingsPage.abrirPagina();
        await settingsPage.realizarLogout();
        await settingsPage.validarLogoutRealizado();
        await navbarPage.validarNavbarNaoAutenticado();
    });
});
