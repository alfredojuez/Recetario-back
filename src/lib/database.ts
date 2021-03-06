import chalk from 'chalk';
import MongoClient from 'mongodb';
import { LINEAS } from '../config/constant';
import logTime from '../functions';

class Database {

  async init() {
    //mostramos la hora en el log
    logTime();

    //leemos los datos de las variables de entorno
    const MONGO_DB = process.env.DATABASE || 'mongodb://localhost:27017';

    //Configuracmos el cliente
    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //obtenemos la instancia de la BD
    const db = client.db();

    if (client.isConnected()) {
      console.log(LINEAS.IMPORTANTE_X2);
      console.log(`# ${chalk.blueBright('Conectando con la base de datos...')}`);
      console.log(`# ${LINEAS.SEPARADOR}`)
      console.log(`# STATUS: ${chalk.green('ONLINE')}`);
      console.log(`# MESSAGE: ${chalk.green('Conexión con la base de datos: "' + db.databaseName + '"')}`);
      
    }
    return db;  
  }
}

export default Database;
