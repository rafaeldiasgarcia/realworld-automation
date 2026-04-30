import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — Home', {tag: ['@api', '@contrato']}, () => {

    test('deve listar posts do feed global', {tag: ['@smoke']}, async ({homeService, postCriado}) => {
        await homeService.listarPosts();
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarPostNaLista(postCriado);
    });

    test('deve listar tags populares', {tag: ['@smoke']}, async ({homeService, postCriado}) => {
        await homeService.listarTags();
        await homeService.validarStatus(200);
        await homeService.validarContratoTags();
        await homeService.validarTagNaLista(postCriado.tag);
    });

    test('deve filtrar posts por tag', {tag: ['@regressao']}, async ({homeService, postCriado}) => {
        await homeService.listarPostsPorTag(postCriado.tag);
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarPostNaLista(postCriado);
        await homeService.validarTodosPostsPossuemTag(postCriado.tag);
    });

    test('deve listar feed de autores seguidos', {tag: ['@smoke']}, async ({homeService, contaAutenticada, postDeAutorSeguido}) => {
        await homeService.listarFeed(contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarPostNaLista(postDeAutorSeguido);
        await homeService.validarTodosPostsSaoDoAutor(postDeAutorSeguido.autor.username);
    });

    test('deve favoritar e desfavoritar post', {tag: ['@regressao']}, async ({homeService, contaAutenticada, postCriado}) => {
        await homeService.favoritarPost(postCriado.slug, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarPostFavoritado(1);

        await homeService.desfavoritarPost(postCriado.slug, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarPostDesfavoritado(0);
    });
});
