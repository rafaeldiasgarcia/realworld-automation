import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Register', {tag: ['@frontend']}, () => {
    test.beforeEach(async ({registerPage}) => {
        await registerPage.abrirPagina();
    });

    test('deve cadastrar com dados válidos e redirecionar para home', {tag: ['@smoke']}, async ({registerPage, dadosRegister}) => {

        await registerPage.cadastrar(dadosRegister.valido);
        await registerPage.validarCadastroRealizado();
    });

    test('deve exibir erro ao tentar cadastrar com dados já existentes', {tag: ['@regressao', '@negativo']}, async ({registerPage, dadosRegister}) => {

        for (const {descricao, dadosTeste} of dadosRegister.conflitoCadastro) {
            await test.step(descricao, async () => {

                await registerPage.abrirPagina();
                await registerPage.cadastrar(dadosTeste);
                await registerPage.validarErroExibido();
            });
        }
    });

    test('deve manter botão desabilitado com formulário vazio', {tag: ['@regressao']}, async ({registerPage}) => {

        await registerPage.validarBotaoDesabilitado();
    });

    test('deve redirecionar para login ao clicar em "Have an account?"', {tag: ['@regressao']}, async ({registerPage}) => {

        await registerPage.validarRedirecionamentoParaLogin();
    });
});
