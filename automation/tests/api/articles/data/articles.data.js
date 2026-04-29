import {faker} from '@faker-js/faker';

export default {
    valido: {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
        tagList: ['playwright', 'automation'],
    },
    semTitulo: {
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(1),
        tagList: [],
    },
};
