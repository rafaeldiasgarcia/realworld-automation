import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Editor', {tag: ['@frontend']}, () => {

    test('deve criar artigo com sucesso e redirecionar', {tag: ['@smoke']}, async ({editorPage, contaAutenticada, dadosEditor}) => {
        await editorPage.abrirPagina();
        await editorPage.preencherFormulario(dadosEditor.valido);
        await editorPage.publicarArtigo();
        await editorPage.validarArtigoPublicado();
    });

    test('deve manter botão desabilitado com formulário vazio', {tag: ['@regressao']}, async ({editorPage, contaAutenticada}) => {
        await editorPage.abrirPagina();
        await editorPage.validarBotaoDesabilitado();
    });

    test('deve exibir erro ao tentar publicar sem título', {tag: ['@regressao', '@negativo']}, async ({editorPage, contaAutenticada, dadosEditor}) => {
        await editorPage.abrirPagina();
        await editorPage.preencherFormulario({...dadosEditor.valido, titulo: ''});
        await editorPage.publicarArtigo();
        await editorPage.validarErroExibido();
    });
});
