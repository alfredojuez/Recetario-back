import { IUserId4email, IUsuario } from './usuario.interface';

export interface IJwt{
    usuario?: IUsuario | IUserId4email;
}