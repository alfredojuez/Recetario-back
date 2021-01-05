import { IResolvers } from "graphql-tools";
import Query from "./query";

//  const resolvers: IResolvers = {
//    ...query
//  };

const resolvers: IResolvers = {
  ...Query
}

export default resolvers;
