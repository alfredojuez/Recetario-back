import resolversTypeReceta from './receta';

//este import no funciona
//import GMR from 'graphql-merge-resolvers';
const GMR = require('@wiicamp/graphql-merge-resolvers'); 

const typeResolvers = GMR.merge([
    resolversTypeReceta
]);

export default typeResolvers;