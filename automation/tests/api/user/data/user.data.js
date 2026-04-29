import {faker} from '@faker-js/faker';

export default {
    atualizacaoValida: {
        bio: faker.lorem.sentence(),
    },
    emailInvalido: {
        email: 'emailinvalido',
    },
};
