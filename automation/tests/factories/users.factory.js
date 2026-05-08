import {faker} from '@faker-js/faker';

export const SENHA_PADRAO = 'Test@1234';

export function criarDadosUsuario() {
    const username = `test${faker.string.alphanumeric(8).toLowerCase()}`;

    return {
        username,
        email: `${username}@example.com`,
        password: SENHA_PADRAO,
    };
}

export function criarDadosAtualizacaoUsuario(username) {
    return {
        bio: faker.lorem.sentence(),
        image: `https://i.pravatar.cc/150?u=${username}`,
    };
}
