import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Home', {tag: ['@frontend']}, () => {

    test('deve exibir feed global com artigos e tags populares', {tag: ['@smoke']}, async ({homePage, postCriado}) => {
        await homePage.abrirPagina();
        await homePage.validarFeedGlobalVisivel(postCriado);
        await homePage.validarTagsPopulares(postCriado);
    });

    test('deve exibir abas de visitante', {tag: ['@regressao']}, async ({homePage}) => {
        await homePage.abrirPagina();
        await homePage.validarAbasDeVisitante();
    });

    test('deve exibir abas de usuário autenticado', {tag: ['@regressao']}, async ({homePage, contaAutenticada}) => {
        await homePage.abrirPagina();
        await homePage.validarAbasDeUsuarioAutenticado();
    });

    test('deve exibir feed dos autores seguidos quando autenticado', {tag: ['@smoke']}, async ({homePage, postDeAutorSeguido}) => {
        await homePage.abrirFeedSeguindo();
        await homePage.validarFeedSeguindoVisivel(postDeAutorSeguido);
    });

    test('deve filtrar artigos por tag popular', {tag: ['@regressao']}, async ({homePage, postCriado}) => {
        await homePage.abrirPagina();
        await homePage.filtrarPorTagPopular(postCriado.tag);
        await homePage.validarFiltroPorTagPopular(postCriado);
    });

    test('deve favoritar e desfavoritar artigo atualizando contador', {tag: ['@regressao']}, async ({homePage, contaAutenticada, postCriado}) => {
        await homePage.abrirPagina();
        await homePage.validarPostVisivel(postCriado);
        await homePage.validarQuantidadeFavoritosDoPost(postCriado, 0);
        await homePage.favoritarPost(postCriado);
        await homePage.validarQuantidadeFavoritosDoPost(postCriado, 1);
        await homePage.favoritarPost(postCriado);
        await homePage.validarQuantidadeFavoritosDoPost(postCriado, 0);
    });

    test('deve redirecionar visitante para cadastro ao favoritar artigo', {tag: ['@regressao']}, async ({homePage}) => {
        await homePage.abrirPagina();
        await homePage.favoritarPrimeiroArtigo();
        await homePage.validarVisitanteRedirecionadoParaCadastro();
    });

    test('deve abrir detalhe do artigo ao clicar no preview', {tag: ['@regressao']}, async ({homePage}) => {
        await homePage.abrirPagina();
        await homePage.abrirPrimeiroArtigo();
        await homePage.validarArtigoAberto();
    });

    test('deve redirecionar visitante para login ao acessar Your Feed pela URL', {tag: ['@regressao', '@negativo']}, async ({homePage}) => {
        await homePage.abrirFeedSeguindo();
        await homePage.validarRedirecionamentoParaLogin();
    });
});
