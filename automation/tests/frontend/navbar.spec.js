import {test} from '../../fixtures/frontend.fixture.js';

test.describe('Navbar', {tag: ['@frontend']}, () => {

    test('deve exibir itens de visitante quando não autenticado', {tag: ['@smoke']}, async ({page, navbarPage}) => {
        await page.goto('/');
        await navbarPage.validarNavbarNaoAutenticado();
    });

    test('deve exibir itens de usuário quando autenticado', {tag: ['@smoke']}, async ({page, navbarPage, contaAutenticada}) => {
        await page.goto('/');
        await navbarPage.validarNavbarAutenticado(contaAutenticada.username);
    });
});
