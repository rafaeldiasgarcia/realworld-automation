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
    semDescription: {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(1),
        tagList: [],
    },
    semBody: {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        tagList: [],
    },
    semTagList: {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(1),
    },
    tagListVazia: {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(1),
        tagList: [],
    },
    atualizacao: {
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(2),
    },
    comentario: {
        body: faker.lorem.sentence(),
    },
    comentarioSemCorpo: {
        body: '',
    },
    slugInexistente: `artigo-inexistente-${faker.string.alphanumeric(10).toLowerCase()}`,
    comentarioIdInexistente: faker.string.uuid(),
};
