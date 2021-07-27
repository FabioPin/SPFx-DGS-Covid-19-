import {IConcelhosService} from './IConcelhosService';
import { HttpClient } from '@microsoft/sp-http';
import {IConcelho} from '../models/IConcelho';
// Import model historico

export class ConcelhosService implements IConcelhosService {

    private httpClient: HttpClient;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
    }

    //obter dados Concelhos

    public async getConcelhos(): Promise<IConcelho[]> {
        
        const response = await this.httpClient.get('https://covid19-api.vost.pt/Requests/get_last_update_counties',
        HttpClient.configurations.v1
        );

        if(!response) {
            const error = await response.text();
            console.log(error);
            throw Error(`Erro ao tentar obter dados`);

        }

        const result: IConcelho[] = await response.json();

        console.log(result);
        console.log(result.length);

        if(result.length > 0) {
            return result;
        } else {
            return null;
        }
    }
}