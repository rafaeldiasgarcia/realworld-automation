import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — /articles', {tag: ['@api', '@contrato']}, () => {

    test('deve criar artigo com sucesso e retornar 201 com contrato', {tag: ['@smoke']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.valido, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.validarContratoArtigo();
    });

    test('deve retornar 422 ao tentar criar artigo sem título', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.semTitulo, contaAutenticada.token);
        await articlesService.validarStatus(422);
        await articlesService.validarErroNoCampo('title');
    });

    test('deve obter artigo por slug com contrato', {tag: ['@smoke']}, async ({articlesService, postCriado}) => {
        await articlesService.obter(postCriado.slug);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoArtigo();
        await articlesService.validarDadosDoArtigo(postCriado);
    });

    test('deve atualizar artigo do próprio autor', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postDoUsuarioAutenticado, dadosArticles}) => {
        await articlesService.atualizar(postDoUsuarioAutenticado.slug, dadosArticles.atualizacao, contaAutenticada.token);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoArtigo();
        await articlesService.validarArtigoAtualizado(dadosArticles.atualizacao);
    });

    test('deve deletar artigo do próprio autor', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postDoUsuarioAutenticado}) => {
        await articlesService.deletar(postDoUsuarioAutenticado.slug, contaAutenticada.token);
        await articlesService.validarStatus(204);
    });

    test('deve retornar 403 ao tentar atualizar artigo de outro autor', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.atualizar(postCriado.slug, dadosArticles.atualizacao, contaAutenticada.token);
        await articlesService.validarStatus(403);
    });

    test('deve retornar 403 ao tentar deletar artigo de outro autor', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, postCriado}) => {
        await articlesService.deletar(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(403);
    });

    test('deve listar comentários de artigo com contrato', {tag: ['@smoke']}, async ({articlesService, postCriado}) => {
        await articlesService.listarComentarios(postCriado.slug);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoComentarios();
    });

    test('deve criar comentário em artigo', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentario, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.validarContratoComentario();
        await articlesService.validarComentarioCriado(dadosArticles.comentario);
    });

    test('deve listar comentário criado', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentario, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.listarComentarios(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoComentarios();
        await articlesService.validarComentarioNaLista(dadosArticles.comentario);
    });

    test('deve deletar comentário do próprio autor', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentario, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.deletarComentario(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(204);
        await articlesService.listarComentarios(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(200);
        await articlesService.validarComentarioAusente(dadosArticles.comentario);
    });

    test('deve retornar 422 ao tentar comentar sem corpo', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentarioSemCorpo, contaAutenticada.token);
        await articlesService.validarStatus(422);
        await articlesService.validarErroNoCampo('body');
    });
});
