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
});
