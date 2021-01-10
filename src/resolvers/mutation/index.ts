import GMR from '@wiicamp/graphql-merge-resolvers';
import resolversMutationUsuario from './usuario';

const mutationResolvers = GMR.merge([
    resolversMutationUsuario,
]);

export default mutationResolvers;