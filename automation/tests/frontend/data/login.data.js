export default {
    valido: {
        email: 'rafael@conduit.com',
        senha: 'Test@1234',
    },

    // Credenciais inválidas — mesmo comportamento esperado, dados diferentes
    credenciaisInvalidas: [
        {
            descricao: 'email não cadastrado',
            dadosTeste: {
                email: 'naoexiste@conduit.com',
                senha: 'Test@1234',
            },
        },
        {
            descricao: 'senha incorreta',
            dadosTeste: {
                email: 'rafael@conduit.com',
                senha: 'SenhaErrada123',
            },
        },
    ],
};
