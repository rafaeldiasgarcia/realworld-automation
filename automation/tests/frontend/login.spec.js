import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Login', {tag: ['@frontend']}, () => {
    test.beforeEach(async ({loginPage}) => {
        await loginPage.abrirPagina();
    });

    test('deve logar com dados válidos e redirecionar para home', {tag: ['@smoke']}, async ({loginPage, dadosLogin}) => {

        await loginPage.logar(dadosLogin.valido);
        await loginPage.validarLoginRealizado();
    });

    test('deve exibir erro ao tentar logar com credenciais inválidas', {tag: ['@regressao', '@negativo']}, async ({loginPage, dadosLogin}) => {

        for (const {descricao, dadosTeste} of dadosLogin.credenciaisInvalidas) {
            await test.step(descricao, async () => {

                await loginPage.abrirPagina();
                await loginPage.logar(dadosTeste);
                await loginPage.validarErroExibido();
            });
        }
    });

    test('deve manter botão desabilitado com formulário vazio', {tag: ['@regressao']}, async ({loginPage}) => {

        await loginPage.validarBotaoDesabilitado();
    });

    test('deve redirecionar para cadastro ao clicar em "Need an account?"', {tag: ['@regressao']}, async ({loginPage}) => {

        await loginPage.validarRedirecionamentoParaCadastro();
    });
});
