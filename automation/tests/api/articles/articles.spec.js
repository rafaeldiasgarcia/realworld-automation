import {test} from '../../../fixtures/api.fixture.js';

test.describe('API - /articles', {tag: ['@api', '@contrato']}, () => {

    test('deve criar artigo com sucesso e retornar 201 com contrato', {tag: ['@smoke']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.valido, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.validarContratoArtigo();
    });

    test('deve retornar 401 ao tentar criar artigo sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({articlesService, dadosArticles}) => {
        await articlesService.criar(dadosArticles.valido);
        await articlesService.validarStatus(401);
    });

    test('deve retornar 422 ao tentar criar artigo sem titulo', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.semTitulo, contaAutenticada.token);
        await articlesService.validarStatus(422);
        await articlesService.validarErroNoCampo('title');
    });

    test('deve retornar 422 ao tentar criar artigo sem descricao', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.semDescription, contaAutenticada.token);
        await articlesService.validarStatus(422);
        await articlesService.validarErroNoCampo('description');
    });

    test('deve retornar 422 ao tentar criar artigo sem corpo', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.semBody, contaAutenticada.token);
        await articlesService.validarStatus(422);
        await articlesService.validarErroNoCampo('body');
    });

    test('deve criar artigo sem tagList mantendo contrato', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.semTagList, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.validarContratoArtigo();
        await articlesService.validarTagListDoArtigo([]);
    });

    test('deve criar artigo com tagList vazia mantendo contrato', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.criar(dadosArticles.tagListVazia, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.validarContratoArtigo();
        await articlesService.validarTagListDoArtigo([]);
    });

    test('deve obter artigo por slug com contrato', {tag: ['@smoke']}, async ({articlesService, postCriado}) => {
        await articlesService.obter(postCriado.slug);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoArtigo();
        await articlesService.validarDadosDoArtigo(postCriado);
    });

    test('deve retornar 404 ao obter artigo inexistente', {tag: ['@regressao', '@negativo']}, async ({articlesService, dadosArticles}) => {
        await articlesService.obter(dadosArticles.slugInexistente);
        await articlesService.validarStatus(404);
    });

    test('deve atualizar artigo do proprio autor', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postDoUsuarioAutenticado, dadosArticles}) => {
        await articlesService.atualizar(postDoUsuarioAutenticado.slug, dadosArticles.atualizacao, contaAutenticada.token);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoArtigo();
        await articlesService.validarArtigoAtualizado(dadosArticles.atualizacao);
    });

    test('deve retornar 401 ao tentar atualizar artigo sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({articlesService, postCriado, dadosArticles}) => {
        await articlesService.atualizar(postCriado.slug, dadosArticles.atualizacao);
        await articlesService.validarStatus(401);
    });

    test('deve retornar 404 ao atualizar artigo inexistente', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.atualizar(dadosArticles.slugInexistente, dadosArticles.atualizacao, contaAutenticada.token);
        await articlesService.validarStatus(404);
    });

    test('deve deletar artigo do proprio autor', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postDoUsuarioAutenticado}) => {
        await articlesService.deletar(postDoUsuarioAutenticado.slug, contaAutenticada.token);
        await articlesService.validarStatus(204);
    });

    test('deve retornar 401 ao tentar deletar artigo sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({articlesService, postCriado}) => {
        await articlesService.deletar(postCriado.slug);
        await articlesService.validarStatus(401);
    });

    test('deve retornar 404 ao deletar artigo inexistente', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.deletar(dadosArticles.slugInexistente, contaAutenticada.token);
        await articlesService.validarStatus(404);
    });

    test('deve retornar 403 ao tentar atualizar artigo de outro autor', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.atualizar(postCriado.slug, dadosArticles.atualizacao, contaAutenticada.token);
        await articlesService.validarStatus(403);
    });

    test('deve retornar 403 ao tentar deletar artigo de outro autor', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, postCriado}) => {
        await articlesService.deletar(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(403);
    });

    test('deve listar comentarios de artigo com contrato', {tag: ['@smoke']}, async ({articlesService, postCriado}) => {
        await articlesService.listarComentarios(postCriado.slug);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoComentarios();
    });

    test('deve retornar 404 ao listar comentarios de artigo inexistente', {tag: ['@regressao', '@negativo']}, async ({articlesService, dadosArticles}) => {
        await articlesService.listarComentarios(dadosArticles.slugInexistente);
        await articlesService.validarStatus(404);
    });

    test('deve criar comentario em artigo', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentario, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.validarContratoComentario();
        await articlesService.validarComentarioCriado(dadosArticles.comentario);
        await articlesService.validarAutorDoComentario(contaAutenticada.username);
    });

    test('deve retornar 401 ao tentar comentar sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({articlesService, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentario);
        await articlesService.validarStatus(401);
    });

    test('deve retornar 404 ao comentar em artigo inexistente', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, dadosArticles}) => {
        await articlesService.comentar(dadosArticles.slugInexistente, dadosArticles.comentario, contaAutenticada.token);
        await articlesService.validarStatus(404);
    });

    test('deve listar comentario criado', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentario, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.listarComentarios(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(200);
        await articlesService.validarContratoComentarios();
        await articlesService.validarComentarioNaLista(dadosArticles.comentario);
    });

    test('deve deletar comentario do proprio autor', {tag: ['@regressao']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentario, contaAutenticada.token);
        await articlesService.validarStatus(201);
        await articlesService.deletarComentario(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(204);
        await articlesService.listarComentarios(postCriado.slug, contaAutenticada.token);
        await articlesService.validarStatus(200);
        await articlesService.validarComentarioAusente(dadosArticles.comentario);
    });

    test('deve retornar 401 ao tentar deletar comentario sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({articlesService, comentarioDeOutroUsuario}) => {
        await articlesService.deletarComentarioPorId(comentarioDeOutroUsuario.post.slug, comentarioDeOutroUsuario.comentarioId);
        await articlesService.validarStatus(401);
    });

    test('deve retornar 403 ao tentar deletar comentario de outro usuario', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, comentarioDeOutroUsuario}) => {
        await articlesService.deletarComentarioPorId(comentarioDeOutroUsuario.post.slug, comentarioDeOutroUsuario.comentarioId, contaAutenticada.token);
        await articlesService.validarStatus(403);
    });

    test('deve retornar 404 ao deletar comentario inexistente', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.deletarComentarioPorId(postCriado.slug, dadosArticles.comentarioIdInexistente, contaAutenticada.token);
        await articlesService.validarStatus(404);
    });

    test('deve retornar 422 ao tentar comentar sem corpo', {tag: ['@regressao', '@negativo']}, async ({articlesService, contaAutenticada, postCriado, dadosArticles}) => {
        await articlesService.comentar(postCriado.slug, dadosArticles.comentarioSemCorpo, contaAutenticada.token);
        await articlesService.validarStatus(422);
        await articlesService.validarErroNoCampo('body');
    });
});
