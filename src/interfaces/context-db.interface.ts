import { Db } from 'mongodb';

export interface IContextDB {
    db?: Db;
    token?: string;
}