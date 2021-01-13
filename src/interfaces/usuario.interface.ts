// enum Perfil
// {
//     ADMIN,
//     COOKER,
//     USER
// }

export interface IUsuario{
    id?: String;
    email: String;
    nombre: String;
    apellidos:  String;
    usuario: String;
    pass: String;
    foto: String;
    nacionalidad: String;
    perfil: String;
    fechaAlta: String;
    ultimoLogin: String;
    activo: Boolean;
}