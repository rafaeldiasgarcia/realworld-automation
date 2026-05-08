import {test} from '../../../fixtures/api.fixture.js';

test.describe('API - /profiles', {tag: ['@api', '@contrato']}, () => {

    test('deve retornar 200 com contrato do perfil', {tag: ['@smoke']}, async ({profilesService, outroUsuario}) => {
        await profilesService.obterPerfil(outroUsuario.username);
        await profilesService.validarStatus(200);
        await profilesService.validarContratoPerfil();
    });

    test('deve retornar 200 com following false quando nao autenticado', {tag: ['@regressao']}, async ({profilesService, outroUsuario}) => {
        await profilesService.obterPerfil(outroUsuario.username);
        await profilesService.validarStatus(200);
        await profilesService.validarNaoSeguindo();
    });

    test('deve retornar 404 para perfil inexistente', {tag: ['@regressao', '@negativo']}, async ({profilesService, usernameInexistente}) => {
        await profilesService.obterPerfil(usernameInexistente);
        await profilesService.validarStatus(404);
    });

    test('deve seguir usuario e retornar 200 com following true', {tag: ['@smoke']}, async ({profilesService, contaAutenticada, outroUsuario}) => {
        await profilesService.seguir(outroUsuario.username, contaAutenticada.token);
        await profilesService.validarStatus(200);
        await profilesService.validarContratoPerfil();
        await profilesService.validarSeguindo();
    });

    test('deve retornar 401 ao tentar seguir usuario sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({profilesService, outroUsuario}) => {
        await profilesService.seguir(outroUsuario.username);
        await profilesService.validarStatus(401);
    });

    test('deve deixar de seguir usuario e retornar 200 com following false', {tag: ['@regressao']}, async ({profilesService, contaAutenticada, outroUsuario}) => {
        await profilesService.seguir(outroUsuario.username, contaAutenticada.token);
        await profilesService.deixarDeSeguir(outroUsuario.username, contaAutenticada.token);
        await profilesService.validarStatus(200);
        await profilesService.validarContratoPerfil();
        await profilesService.validarNaoSeguindo();
    });

    test('deve retornar 401 ao tentar deixar de seguir usuario sem autenticacao', {tag: ['@regressao', '@negativo']}, async ({profilesService, outroUsuario}) => {
        await profilesService.deixarDeSeguir(outroUsuario.username);
        await profilesService.validarStatus(401);
    });
});
