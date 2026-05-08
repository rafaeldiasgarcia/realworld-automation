import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Article', {tag: ['@frontend']}, () => {

    test('deve exibir detalhes do post para visitante', {tag: ['@smoke']}, async ({articlePage, postCriado}) => {
        await articlePage.abrirPagina(postCriado);
        await articlePage.validarDetalhesDoPost(postCriado);
        await articlePage.validarPromptComentarioVisitante();
    });

    test('deve exibir ações de autor para dono do post', {tag: ['@smoke']}, async ({articlePage, postDoUsuarioAutenticado}) => {
        await articlePage.abrirPagina(postDoUsuarioAutenticado);
        await articlePage.validarDetalhesDoPost(postDoUsuarioAutenticado);
        await articlePage.validarAcoesDeAutor();
    });

    test('deve exibir ações de leitor para usuário autenticado que não é autor', {tag: ['@regressao']}, async ({articlePage, contaAutenticada, postCriado}) => {
        await articlePage.abrirPagina(postCriado);
        await articlePage.validarAcoesDeLeitor(postCriado);
    });

    test('deve navegar para edição do próprio post', {tag: ['@regressao']}, async ({articlePage, postDoUsuarioAutenticado}) => {
        await articlePage.abrirPagina(postDoUsuarioAutenticado);
        await articlePage.navegarParaEdicao();
    });

    test('deve deletar o próprio post', {tag: ['@regressao']}, async ({articlePage, postDoUsuarioAutenticado}) => {
        await articlePage.abrirPagina(postDoUsuarioAutenticado);
        await articlePage.deletarPost();
        await articlePage.validarPostDeletado();
    });

    test('deve favoritar e desfavoritar post', {tag: ['@regressao']}, async ({articlePage, contaAutenticada, postCriado}) => {
        await articlePage.abrirPagina(postCriado);
        await articlePage.validarAcoesDeLeitor(postCriado);
        await articlePage.favoritarPost();
        await articlePage.validarPostFavoritado();
        await articlePage.desfavoritarPost();
        await articlePage.validarPostDesfavoritado();
    });

    test('deve seguir e deixar de seguir autor do post', {tag: ['@regressao']}, async ({articlePage, contaAutenticada, postCriado}) => {
        await articlePage.abrirPagina(postCriado);
        await articlePage.seguirAutor();
        await articlePage.validarAutorSeguido();
        await articlePage.deixarDeSeguirAutor();
        await articlePage.validarAutorNaoSeguido();
    });

    test('deve adicionar e excluir comentário', {tag: ['@regressao']}, async ({articlePage, contaAutenticada, postCriado, comentarioArticle}) => {
        await articlePage.abrirPagina(postCriado);
        await articlePage.comentar(comentarioArticle);
        await articlePage.validarComentarioExibido(comentarioArticle);
        await articlePage.excluirComentario();
        await articlePage.validarComentarioRemovido(comentarioArticle);
    });
});
