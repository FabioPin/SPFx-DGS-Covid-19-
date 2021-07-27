import { IConcelho } from '../models/IConcelho';

export interface IConcelhosService {
    //OBter dados atualizados
    getConcelhos(): Promise<IConcelho[]>;
    // Obter historico
}