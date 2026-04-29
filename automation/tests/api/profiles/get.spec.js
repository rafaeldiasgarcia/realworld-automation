import {test} from '../../../fixtures/api.fixture.js';

test.describe('API — GET /profiles/:username', {tag: ['@api', '@contrato']}, () => {

    test('deve retornar 200 com contrato do perfil', {tag: ['@smoke']}, async ({profilesService}) => {
        await profilesService.obterPerfil('rafael');
        await profilesService.validarStatus(200);
        await profilesService.validarContratoPerfil();
    });

    test('deve retornar 200 com following false quando não autenticado', {tag: ['@regressao']}, async ({profilesService}) => {
        await profilesService.obterPerfil('rafael');
        await profilesService.validarStatus(200);
        await profilesService.validarNaoSeguindo();
    });
});
