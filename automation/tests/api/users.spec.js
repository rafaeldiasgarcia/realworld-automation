import {test} from '../../fixtures/api.fixture.js';

test.describe('API — POST /users (cadastro)', () => {

    test('deve retornar 201 ao cadastrar com dados válidos', async ({usersService, dadosUsers}) => {

        await usersService.cadastrar(dadosUsers.valido);
        await usersService.validarStatus(201);
        await usersService.validarContratoCadastro();
    });

    test('deve retornar 422 com erro no campo correto — conflito de cadastro', async ({usersService, dadosUsers}) => {

        for (const {descricao, dadosTeste, campoErro} of dadosUsers.conflitoCadastro) {
            await test.step(descricao, async () => {

                await usersService.cadastrar(dadosTeste);
                await usersService.validarStatus(422);
                await usersService.validarErroNoCampo(campoErro);
            });
        }
    });

    test('deve retornar 422 com erro no campo correto — campos obrigatórios ausentes', async ({usersService, dadosUsers}) => {

        for (const {descricao, dadosTeste, campoErro} of dadosUsers.camposAusentes) {
            await test.step(descricao, async () => {

                await usersService.cadastrar(dadosTeste);
                await usersService.validarStatus(422);
                await usersService.validarErroNoCampo(campoErro);
            });
        }
    });

    test('deve retornar 422 com erro no campo email — email com formato inválido', async ({usersService, dadosUsers}) => {

        await usersService.cadastrar(dadosUsers.emailInvalido);
        await usersService.validarStatus(422);
        await usersService.validarErroNoCampo('email');
    });
});
