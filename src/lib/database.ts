import chalk from "chalk";
import MongoClient from "mongodb";

enum colores
{
  KO = 'red',
  OK = 'green',
};

class Database {

  async init() {

    //leemos los datos de las variables de entorno
    const MONGO_DB = process.env.DATABASE || "mongodb://localhost:27017/recetario";

    //Configuracmos el cliente
    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    //obtenemos la instancia de la BD
    const db = client.db();

    if (client.isConnected()) {
      console.log("===========================================");
      console.log(`Conectando con la base de datos...`);
      console.log(`STATUS: ` + chalk.green("ONLINE"));
      console.log(`NOMBRE: ` + chalk.green(db.databaseName));
      console.log("===========================================");
    }
  }
}

export default Database;
