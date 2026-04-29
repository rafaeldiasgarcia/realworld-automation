import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — POST /users/login', {tag: ['@api', '@contrato']}, () => {

    test('deve retornar 200 ao logar com credenciais válidas', {tag: ['@smoke']}, async ({usersLoginService, dadosLogin}) => {

        await usersLoginService.logar(dadosLogin.valido);
        await usersLoginService.validarStatus(200);
        await usersLoginService.validarContratoUserLogin();
    });

    test('deve retornar 401 — credenciais inválidas', {tag: ['@regressao', '@negativo']}, async ({usersLoginService, dadosLogin}) => {

        for (const {descricao, dadosTeste} of dadosLogin.credenciaisInvalidas) {
            await test.step(descricao, async () => {

                await usersLoginService.logar(dadosTeste);
                await usersLoginService.validarStatus(401);
            });
        }
    });

    test('deve retornar 422 com erro no campo correto — campos obrigatórios ausentes', {tag: ['@regressao', '@negativo']}, async ({usersLoginService, dadosLogin}) => {

        for (const {descricao, dadosTeste, campoErro} of dadosLogin.camposAusentes) {
            await test.step(descricao, async () => {

                await usersLoginService.logar(dadosTeste);
                await usersLoginService.validarStatus(422);
                await usersLoginService.validarErroNoCampo(campoErro);
            });
        }
    });

    test('deve retornar 422 com erro no campo email — email com formato inválido', {tag: ['@regressao', '@negativo']}, async ({usersLoginService, dadosLogin}) => {

        await usersLoginService.logar(dadosLogin.emailInvalido);
        await usersLoginService.validarStatus(422);
        await usersLoginService.validarErroNoCampo('email');
    });
});
