import {test} from '../../../fixtures/api.fixture.js';

test.describe('API - /user', {tag: ['@api', '@contrato']}, () => {

    test('deve retornar 200 com contrato do usuario autenticado', {tag: ['@smoke']}, async ({userService, contaAutenticada}) => {
        await userService.obter(contaAutenticada.token);
        await userService.validarStatus(200);
        await userService.validarContratoUser();
    });

    test('deve retornar 401 ao obter usuario sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({userService}) => {
        await userService.obter();
        await userService.validarStatus(401);
    });

    test('deve atualizar bio com sucesso e retornar 200', {tag: ['@smoke']}, async ({userService, contaAutenticada, dadosUser}) => {
        await userService.atualizar(dadosUser.atualizacaoValida, contaAutenticada.token);
        await userService.validarStatus(200);
        await userService.validarContratoUser();
    });

    test('deve retornar 401 ao atualizar usuario sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({userService, dadosUser}) => {
        await userService.atualizar(dadosUser.atualizacaoValida);
        await userService.validarStatus(401);
    });

    test('deve retornar 422 ao enviar email com formato invalido', {tag: ['@regressao', '@negativo']}, async ({userService, contaAutenticada, dadosUser}) => {
        await userService.atualizar(dadosUser.emailInvalido, contaAutenticada.token);
        await userService.validarStatus(422);
        await userService.validarErroNoCampo('email');
    });

    test('deve retornar 422 ao enviar username vazio', {tag: ['@regressao', '@negativo']}, async ({userService, contaAutenticada, dadosUser}) => {
        await userService.atualizar(dadosUser.usernameVazio, contaAutenticada.token);
        await userService.validarStatus(422);
        await userService.validarErroNoCampo('username');
    });

    test('deve retornar 422 ao enviar email vazio', {tag: ['@regressao', '@negativo']}, async ({userService, contaAutenticada, dadosUser}) => {
        await userService.atualizar(dadosUser.emailVazio, contaAutenticada.token);
        await userService.validarStatus(422);
        await userService.validarErroNoCampo('email');
    });
});
