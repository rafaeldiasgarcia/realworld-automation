export default {
    valido: {
        email: 'rafael@conduit.com',
        password: 'Test@1234',
    },

    // Credenciais inválidas — autenticação falha, status 401
    credenciaisInvalidas: [
        {
            descricao: 'email não cadastrado',
            dadosTeste: {
                email: 'naoexiste@conduit.com',
                password: 'Test@1234',
            },
        },
        {
            descricao: 'senha incorreta',
            dadosTeste: {
                email: 'rafael@conduit.com',
                password: 'SenhaErrada123',
            },
        },
    ],

    // Campos ausentes — validação falha, status 422
    camposAusentes: [
        {
            descricao: 'sem email',
            dadosTeste: {password: 'Test@1234'},
            campoErro: 'email',
        },
        {
            descricao: 'sem password',
            dadosTeste: {email: 'rafael@conduit.com'},
            campoErro: 'password',
        },
    ],

    emailInvalido: {
        email: 'nao-e-um-email',
        password: 'Test@1234',
    },
};
