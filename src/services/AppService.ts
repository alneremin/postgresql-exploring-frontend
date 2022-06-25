
import {ApiService} from "./ApiService";
import {IDatabaseStatusItem, IMetricItem, ITablesColumns, IExploringResultItem, IAnalyzeDatabaseRequest} from "../store/Interfaces";


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

    async getMetrics(query: any): Promise<IMetricItem[]> {
        let result = await ApiService.getMetrics(query);
        return result;
    },

    async getResult(query: any): Promise<IExploringResultItem[]> {
        let result = await ApiService.getExploringResult(query);
        return result;
    },

    async analyzeDatabase(data: any): Promise<IAnalyzeDatabaseRequest[]> {
        let result = await ApiService.analyzeDatabase(data);
        return result;
    },
}