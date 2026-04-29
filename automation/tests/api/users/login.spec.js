import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — POST /users/login', () => {

    test('deve retornar 200 ao logar com credenciais válidas', async ({usersService, dadosLogin}) => {

        await usersService.logar(dadosLogin.valido);
        await usersService.validarStatus(200);
        await usersService.validarContratoUser();
    });

    test('deve retornar 401 — credenciais inválidas', async ({usersService, dadosLogin}) => {

        for (const {descricao, dadosTeste} of dadosLogin.credenciaisInvalidas) {
            await test.step(descricao, async () => {

                await usersService.logar(dadosTeste);
                await usersService.validarStatus(401);
            });
        }
    });

    test('deve retornar 422 com erro no campo correto — campos obrigatórios ausentes', async ({usersService, dadosLogin}) => {

        for (const {descricao, dadosTeste, campoErro} of dadosLogin.camposAusentes) {
            await test.step(descricao, async () => {

                await usersService.logar(dadosTeste);
                await usersService.validarStatus(422);
                await usersService.validarErroNoCampo(campoErro);
            });
        }
    });

    test('deve retornar 422 com erro no campo email — email com formato inválido', async ({usersService, dadosLogin}) => {

        await usersService.logar(dadosLogin.emailInvalido);
        await usersService.validarStatus(422);
        await usersService.validarErroNoCampo('email');
    });
});
