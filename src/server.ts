import express from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
//servidor Apollo
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import expressPlayground from 'graphql-playground-middleware-express'
//configuracion de las VBLes de Entorno
import environment from "./config/environments";
if (process.env.NODE_ENV !== "production") {
  const env = environment;
}
//FIN configuracion de las VBLes de Entorno

console.log("iniciando servidor...");

async function init() {
  const app = express();
  app.use(cors());
  app.use(compression());
  
    const server = new ApolloServer({
    schema,
    introspection: true,
  });

  server.applyMiddleware({ app });

  app.get(
    "/",
    expressPlayground({
      endpoint: "/graphql",
    })
  );

  const httpServer = createServer(app);
  const Puerto = process.env.PORT || 2002;
  httpServer.listen(
    {
      port: Puerto,
    },
    () => {
      console.log(`Escuchando en el puerto ${Puerto}`);
      console.log(`http://localhost:${Puerto}`);
    }
  );
}

init();
