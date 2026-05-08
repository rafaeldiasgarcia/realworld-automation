import {test} from '../../../fixtures/api.fixture.js';

test.describe('API - Home', {tag: ['@api', '@contrato']}, () => {

    test('deve listar posts do feed global', {tag: ['@smoke']}, async ({homeService, postCriado}) => {
        await homeService.listarPosts();
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarPostNaLista(postCriado);
    });

    test('deve listar posts filtrados por autor', {tag: ['@regressao']}, async ({homeService, postCriado}) => {
        await homeService.listarPostsPorAutor(postCriado.author.username);
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarPostNaLista(postCriado);
        await homeService.validarTodosPostsSaoDoAutor(postCriado.author.username);
    });

    test('deve listar posts filtrados por usuario que favoritou', {tag: ['@regressao']}, async ({homeService, contaAutenticada, postFavoritado}) => {
        await homeService.listarPostsFavoritadosPor(contaAutenticada.username, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarPostNaLista(postFavoritado);
        await homeService.validarTodosPostsFavoritados();
    });

    test('deve respeitar limite de paginacao', {tag: ['@regressao']}, async ({homeService, postsParaPaginacao}) => {
        await homeService.listarPostsPaginados({limit: 1, offset: 0});
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarLimiteRespeitado(1);
        await homeService.validarQuantidadeTotalMaiorOuIgualA(postsParaPaginacao.length);
    });

    test('deve combinar filtros de tag e autor', {tag: ['@regressao']}, async ({homeService, postCriado}) => {
        await homeService.listarPostsComFiltros({
            tag: postCriado.tag,
            author: postCriado.author.username,
        });
        await homeService.validarStatus(200);
        await homeService.validarContratoListaPosts();
        await homeService.validarPostNaLista(postCriado);
        await homeService.validarTodosPostsPossuemTag(postCriado.tag);
        await homeService.validarTodosPostsSaoDoAutor(postCriado.author.username);
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

    test('deve retornar 401 ao listar feed sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({homeService}) => {
        await homeService.listarFeed();
        await homeService.validarStatus(401);
    });

    test('deve favoritar e desfavoritar post', {tag: ['@regressao']}, async ({homeService, contaAutenticada, postCriado}) => {
        await homeService.favoritarPost(postCriado.slug, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarPostFavoritado(1);

        await homeService.desfavoritarPost(postCriado.slug, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarPostDesfavoritado(0);
    });

    test('deve retornar 401 ao favoritar post sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({homeService, postCriado}) => {
        await homeService.favoritarPost(postCriado.slug);
        await homeService.validarStatus(401);
    });

    test('deve retornar 401 ao desfavoritar post sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({homeService, postCriado}) => {
        await homeService.desfavoritarPost(postCriado.slug);
        await homeService.validarStatus(401);
    });

    test('deve manter favorito consistente ao favoritar post ja favoritado', {tag: ['@regressao']}, async ({homeService, contaAutenticada, postCriado}) => {
        await homeService.favoritarPost(postCriado.slug, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.favoritarPost(postCriado.slug, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarPostFavoritado(1);
    });

    test('deve manter favorito consistente ao desfavoritar post nao favoritado', {tag: ['@regressao']}, async ({homeService, contaAutenticada, postCriado}) => {
        await homeService.desfavoritarPost(postCriado.slug, contaAutenticada.token);
        await homeService.validarStatus(200);
        await homeService.validarPostDesfavoritado(0);
    });

    test('deve retornar 404 ao favoritar post inexistente', {tag: ['@regressao', '@negativo']}, async ({homeService, contaAutenticada, dadosArticles}) => {
        await homeService.favoritarPost(dadosArticles.slugInexistente, contaAutenticada.token);
        await homeService.validarStatus(404);
    });
});
