import {faker} from '@faker-js/faker';

export default {
    valido: {
        titulo: faker.lorem.sentence(),
        descricao: faker.lorem.sentence(),
        corpo: faker.lorem.paragraphs(2),
        tags: 'playwright automation',
    },
};
