import {test} from '../../fixtures/frontend.fixture.js';
import dadosRegister from './data/register.data.js';

test.describe('Register', () => {
    test.beforeEach(async ({registerPage}) => {

        await registerPage.abrirPagina();
    });

    test('deve cadastrar com dados válidos e redirecionar para home', async ({registerPage}) => {

        await registerPage.cadastrar(dadosRegister.valido);
        await registerPage.validarCadastroRealizado();
    });

    for (const {descricao, dadosTeste} of dadosRegister.conflitoCadastro) {
        test(`deve exibir erro ao tentar cadastrar — ${descricao}`, async ({registerPage}) => {

            await registerPage.cadastrar(dadosTeste);
            await registerPage.validarErroExibido();
        });
    }

    test('deve manter botão desabilitado com formulário vazio', async ({registerPage}) => {

        await registerPage.validarBotaoDesabilitado();
    });

    test('deve redirecionar para login ao clicar em "Have an account?"', async ({registerPage}) => {

        await registerPage.validarRedirecionamentoParaLogin();
    });
});
