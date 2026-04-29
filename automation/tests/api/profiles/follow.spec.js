import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — /profiles/:username/follow', {tag: ['@api', '@contrato']}, () => {

    test('deve seguir usuário e retornar 200 com following true', {tag: ['@smoke']}, async ({profilesService, contaAutenticada, outroUsuario}) => {
        await profilesService.seguir(outroUsuario.username, contaAutenticada.token);
        await profilesService.validarStatus(200);
        await profilesService.validarContratoPerfil();
        await profilesService.validarSeguindo();
    });

    test('deve deixar de seguir usuário e retornar 200 com following false', {tag: ['@regressao']}, async ({profilesService, contaAutenticada, outroUsuario}) => {
        await profilesService.seguir(outroUsuario.username, contaAutenticada.token);
        await profilesService.deixarDeSeguir(outroUsuario.username, contaAutenticada.token);
        await profilesService.validarStatus(200);
        await profilesService.validarContratoPerfil();
        await profilesService.validarNaoSeguindo();
    });
});
