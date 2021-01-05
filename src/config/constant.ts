import environment from './environments';

if(process.env.NODE_ENV !== 'production')
{
    const env=environment;
}

export const SECRET_KEY = process.env.SECRET || "3n un lug4r d3 l4 M4nch4";

export enum COLLECTIONS{
    USER="usuarios"
}