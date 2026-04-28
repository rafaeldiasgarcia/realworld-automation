import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Register', () => {
    test.beforeEach(async ({registerPage}) => {

        await registerPage.abrirPagina();
    });

    test('deve cadastrar com dados válidos e redirecionar para home', async ({registerPage, dadosRegister}) => {

        await registerPage.cadastrar(dadosRegister.valido);
        await registerPage.validarCadastroRealizado();
    });

    test('deve exibir erro ao tentar cadastrar com dados já existentes', async ({registerPage, dadosRegister}) => {

        for (const {descricao, dadosTeste} of dadosRegister.conflitoCadastro) {
            await test.step(descricao, async () => {

                await registerPage.abrirPagina();
                await registerPage.cadastrar(dadosTeste);
                await registerPage.validarErroExibido();
            });
        }
    });

    test('deve manter botão desabilitado com formulário vazio', async ({registerPage}) => {

        await registerPage.validarBotaoDesabilitado();
    });

    test('deve redirecionar para login ao clicar em "Have an account?"', async ({registerPage}) => {

        await registerPage.validarRedirecionamentoParaLogin();
    });
});
