
import {ApiService} from "./ApiService";
import {IDatabaseStatusItem, IGetContentItem, ITablesColumns} from "../store/Interfaces";


export const AppService = {
    TAG: "AppService",

    //------------------------------------------------------------------------------------------------------------------
    
    async getTables(query: any): Promise<ITablesColumns> {
        let result = await ApiService.getTables(query);
        return result;
    },

    async getDatabasesState(query: any): Promise<IDatabaseStatusItem[]> {
        let result = await ApiService.getDatabasesState(query);
        return result;
    },
}