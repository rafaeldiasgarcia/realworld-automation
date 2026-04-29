import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — POST /users (cadastro)', {tag: ['@api', '@contrato']}, () => {

    test('deve retornar 201 ao cadastrar com dados válidos', {tag: ['@smoke']}, async ({usersService, dadosRegister}) => {

        await usersService.cadastrar(dadosRegister.valido);
        await usersService.validarStatus(201);
        await usersService.validarContratoUser();
    });

    test('deve retornar 422 com erro no campo correto — conflito de cadastro', {tag: ['@regressao', '@negativo']}, async ({usersService, dadosRegister}) => {

        for (const {descricao, dadosTeste, campoErro} of dadosRegister.conflitoCadastro) {
            await test.step(descricao, async () => {

                await usersService.cadastrar(dadosTeste);
                await usersService.validarStatus(422);
                await usersService.validarErroNoCampo(campoErro);
            });
        }
    });

    test('deve retornar 422 com erro no campo correto — campos obrigatórios ausentes', {tag: ['@regressao', '@negativo']}, async ({usersService, dadosRegister}) => {

        for (const {descricao, dadosTeste, campoErro} of dadosRegister.camposAusentes) {
            await test.step(descricao, async () => {

                await usersService.cadastrar(dadosTeste);
                await usersService.validarStatus(422);
                await usersService.validarErroNoCampo(campoErro);
            });
        }
    });

    test('deve retornar 422 com erro no campo email — email com formato inválido', {tag: ['@regressao', '@negativo']}, async ({usersService, dadosRegister}) => {

        await usersService.cadastrar(dadosRegister.emailInvalido);
        await usersService.validarStatus(422);
        await usersService.validarErroNoCampo('email');
    });
});
