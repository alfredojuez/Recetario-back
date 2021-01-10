import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
//servidor Apollo
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
//configuracion de las VBLes de Entorno
import environment from './config/environments';
import Database from './lib/database';
import chalk from 'chalk';
import IContext from './interfaces/context.interface';

if (process.env.NODE_ENV !== 'production') {
  const env = environment;
}
//FIN configuracion de las VBLes de Entorno

function logStarServer() {
  let barra = '';
  let escalon = 4;
  for (let i = 0; i < 20; i++) {
    barra += '·';
    if (i % 5 === 0) {
      console.log(chalk.gray(barra));
    }
  }
  console.log(chalk.gray('iniciando servidor...'));
}


async function init() {
  logStarServer();
  const app = express();
  app.use('*', cors());
  app.use(compression());

  const database = new Database();
  const db = await database.init();
  
  //const context = { db };
  const context = async ({req, connection}:IContext) => {
    const token = (req) ? req.headers.authorization  : connection.authorization;
    return {db, token};
  };

  const server = new ApolloServer({
    schema,
    introspection: true,
    context
  });

  server.applyMiddleware({ app });

  app.get(
    '/',
    expressPlayground({
      endpoint: '/graphql',
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
