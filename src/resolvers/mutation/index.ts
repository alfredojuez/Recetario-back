//import GMR from '@wiicamp/graphql-merge-resolvers';
import resolversMutationCategoria from './categoria';
import resolversMutationIngrediente from './ingrediente';
import resolversMutationNacionalidad from './nacionalidad';
import resolversMutationUsuario from './usuario';

const GMR = require('@wiicamp/graphql-merge-resolvers');

const mutationResolvers = GMR.merge([
    resolversMutationUsuario,
    resolversMutationNacionalidad,
    resolversMutationIngrediente,
    resolversMutationCategoria,
]);

export default mutationResolvers;