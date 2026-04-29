import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — /user', {tag: ['@api', '@contrato']}, () => {

    test('deve retornar 200 com contrato do usuário autenticado', {tag: ['@smoke']}, async ({userService, contaAutenticada}) => {
        await userService.obter(contaAutenticada.token);
        await userService.validarStatus(200);
        await userService.validarContratoUser();
    });

    test('deve atualizar bio com sucesso e retornar 200', {tag: ['@smoke']}, async ({userService, contaAutenticada, dadosUser}) => {
        await userService.atualizar(dadosUser.atualizacaoValida, contaAutenticada.token);
        await userService.validarStatus(200);
        await userService.validarContratoUser();
    });

    test('deve retornar 422 ao enviar email com formato inválido', {tag: ['@regressao', '@negativo']}, async ({userService, contaAutenticada, dadosUser}) => {
        await userService.atualizar(dadosUser.emailInvalido, contaAutenticada.token);
        await userService.validarStatus(422);
        await userService.validarErroNoCampo('email');
    });
});
