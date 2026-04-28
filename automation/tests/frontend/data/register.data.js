import {faker} from '@faker-js/faker';

const gerarUsername = () =>
    faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').slice(0, 15) +
    faker.number.int({min: 100, max: 999});

export default {
    valido: {
        username: gerarUsername(),
        email: faker.internet.email(),
        senha: 'Test@1234',
    },

    // Conflito de cadastro — mesmo comportamento esperado, dados diferentes
    conflitoCadastro: [
        {
            descricao: 'email já cadastrado',
            dadosTeste: {
                username: gerarUsername(),
                email: 'rafael@conduit.com',
                senha: 'Test@1234',
            },
        },
        {
            descricao: 'username já cadastrado',
            dadosTeste: {
                username: 'rafael',
                email: faker.internet.email(),
                senha: 'Test@1234',
            },
        },
    ],
};
