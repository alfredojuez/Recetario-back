import chalk from 'chalk';
import { COLLECTIONS, LINEAS } from '../../config/constant';
import { logResponse, logTime } from '../../functions';

import { IResolvers } from 'graphql-tools';
import NacionalidadesService from '../../services/nacionalidades.service';
import IngredientesService from '../../services/ingredientes.service';
import IngredientesXRecetaService from '../../services/ingredientesxreceta';

const resolversTypeReceta: IResolvers = {
  Receta: {
    // idCategoria: (parent) => parent.categoria_id

    /*
        esto es lo que tenemos que resolver.
        nacionalidad: Nacionalidad
        ingredientes: [Ingrediente]
        categorias: [Categoria]
        pasos: [Int]!
        */

    nacionalidad: async (parent, __, context) => {
      const result = await new NacionalidadesService({}, { idNacionalidad: parent.idNacionalidad }, context).details();
      return result.nacionalidad;
    },

    ingredientes: async (parent, __, context) => {
      const result = await new IngredientesXRecetaService({}, { idReceta: parent.idReceta }, context).items();
      
      return result.ingredientesxreceta;
    },

  },
};

export default resolversTypeReceta;
