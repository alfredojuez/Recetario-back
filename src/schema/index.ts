import 'graphql-import-node';
import resolvers from './../resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

// convertimos lo comentado como // ** a typescript

// Para cargar de manera sincrona los ficheros
// ** const { loadFilesSync } = require('@graphql-tools/load-files');
import {loadFilesSync} from '@graphql-tools/load-files';

// Para hacer la mezcla de los tipos de definiciones
// ** const { mergeTypeDefs } = require('@graphql-tools/merge');
import { mergeTypeDefs } from '@graphql-tools/merge';

// Obtenemos cualquier directorio con ficheros GraphQL
const loadedFiles = loadFilesSync(`${__dirname}/**/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs, 
  resolvers,
  resolverValidationOptions:{
    requireResolversForResolveType: 'ignore'
  }
});

export default schema;
