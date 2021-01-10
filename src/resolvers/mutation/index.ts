//import GMR from '@wiicamp/graphql-merge-resolvers';
import resolversMutationUsuario from './usuario';

const GMR = require('@wiicamp/graphql-merge-resolvers');

const mutationResolvers = GMR.merge([
    resolversMutationUsuario,
]);

export default mutationResolvers;