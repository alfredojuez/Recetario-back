import resolversQueryCategorias from './categoria';
import resolversQueryIngredientes from './ingrediente';
import resolversQueryNacionalidades from './nacionalidad';
import resolversQueryRecetas from './receta';
import resolversQueryUsuarios from './usuario';

//este import no funciona
//import GMR from 'graphql-merge-resolvers';
const GMR = require('@wiicamp/graphql-merge-resolvers'); 

const queryResolvers = GMR.merge([
    resolversQueryUsuarios,
    resolversQueryIngredientes, 
    resolversQueryCategorias,
    resolversQueryNacionalidades,
    resolversQueryRecetas,
]);

export default queryResolvers;