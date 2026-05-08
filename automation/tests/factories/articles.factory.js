import {faker} from '@faker-js/faker';

export function criarDadosPost() {
    const tag = `tag-${faker.string.alphanumeric(8).toLowerCase()}`;

    return {
        dados: {
            title: `Artigo ${faker.string.alphanumeric(10)}`,
            description: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(2),
            tagList: [tag],
        },
        tag,
    };
}

export function criarComentarioArticle() {
    return faker.lorem.sentence();
}
