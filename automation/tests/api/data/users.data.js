import {faker} from '@faker-js/faker';

const gerarUsername = () =>
    faker.internet.username().replace(/[^a-zA-Z0-9]/g, '').slice(0, 15) +
    faker.number.int({min: 100, max: 999});

export default {
    valido: {
        username: gerarUsername(),
        email: faker.internet.email(),
        password: 'Test@1234',
    },

    // Conflito de cadastro — dados que já existem no banco (seed V2)
    conflitoCadastro: [
        {
            descricao: 'email já cadastrado',
            dadosTeste: {
                username: gerarUsername(),
                email: 'rafael@conduit.com',
                password: 'Test@1234',
            },
            campoErro: 'email',
        },
        {
            descricao: 'username já cadastrado',
            dadosTeste: {
                username: 'rafael',
                email: faker.internet.email(),
                password: 'Test@1234',
            },
            campoErro: 'username',
        },
    ],

    // Campos ausentes — cada entrada omite um campo obrigatório
    camposAusentes: [
        {
            descricao: 'sem email',
            dadosTeste: {username: gerarUsername(), password: 'Test@1234'},
            campoErro: 'email',
        },
        {
            descricao: 'sem username',
            dadosTeste: {email: faker.internet.email(), password: 'Test@1234'},
            campoErro: 'username',
        },
        {
            descricao: 'sem password',
            dadosTeste: {username: gerarUsername(), email: faker.internet.email()},
            campoErro: 'password',
        },
    ],

    emailInvalido: {
        username: gerarUsername(),
        email: 'nao-e-um-email',
        password: 'Test@1234',
    },
};
