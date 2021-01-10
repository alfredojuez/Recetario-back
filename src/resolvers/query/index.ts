import resolversQueryIngredientes from './ingrediente';
import resolversQueryUsuarios from './usuario';

//este import no funciona
//import GMR from 'graphql-merge-resolvers';
const GMR = require('@wiicamp/graphql-merge-resolvers'); 

const queryResolvers = GMR.merge([
    resolversQueryUsuarios,
    resolversQueryIngredientes, 
]);

export default queryResolvers;