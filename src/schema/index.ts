import "graphql-import-node";
import typeDefs from "./schema.graphql";
import resolvers from "./../resolvers";
import { makeExecutableSchema } from "apollo-server-express";
import { GraphQLSchema } from "graphql";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs, 
  resolvers:resolvers as any
});

export default schema;
