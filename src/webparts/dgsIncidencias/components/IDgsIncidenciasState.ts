import {IConcelho} from '../../../models/IConcelho';

export interface IDgsIncidenciasState {
    isLoading: boolean;
    concelhosInfo: IConcelho[];
    dataError: string;
    showModal: boolean;
    concelho: string;
    dataInicio: string;
    dataFinal: string;
}