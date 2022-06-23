import HttpService from "./HttpService";
import {Log} from "../utils/log";
import constants from "../res/constants";

export const objProp = (obj: any, prop: string) => obj[prop];

const SERVER_URL_PARAM = constants.config.serverUrl;

const DATABASE_BASE_URL = `${SERVER_URL_PARAM}/api/database`;
const SETTINGS_BASE_URL = `${SERVER_URL_PARAM}/api/settings`;

const URL_GET_DATABASES_STATE = `${DATABASE_BASE_URL}`;
const URL_GET_TABLES = `${SETTINGS_BASE_URL}/tables`;

export const ApiService = {
    TAG: "ApiService",
    
    async getTables(query: any) {
        return this.__get(URL_GET_TABLES, query);
    },

    async getDatabasesState(query: any) {
        return this.__get(URL_GET_DATABASES_STATE, query);
    },

    //==================================================================================================================

    __config(data?: any) {
        return {
            headers: {
                // Authorization: `Bearer ${LocalStore.token()}`,
                "Content-Type": "application/json",
                // "Access-Control-Allow-Credentials": false
            },
            params: {
                ...data
            }
        };
    },

    __url(path: string) {
        return path //.replace(SERVER_URL_PARAM, this.serverURL);
    },

    __get(path: string, data?: any) {
        const url = this.__url(path);
        return HttpService.get(this.__url(url), this.__config(data))
            .then((res: any) => {
                this.__logResult("__get", url, this.__config(), data, res);
                
                return res.data.result;
            })
            .catch((error: any) => {
                this.__processError("__get", url, this.__config(), data, error);
                return undefined;
            });
    },

    __post(path: string, data?: any) {
        const url = this.__url(path);
        return HttpService.post(this.__url(url), data, this.__config())
            .then((res: any) => {
                this.__logResult("__post", url, this.__config(), data, res);
                return res.data.result;
            })
            .catch((error: any) => {
                this.__processError("__post", url, this.__config(), data, error);
                return undefined;
            });
    },

    __del(path: string, data?: any) {
        const url = this.__url(path);
        return HttpService.delete(this.__url(url), this.__config(data))
            .then((res: any) => {
                this.__logResult("__del", url, this.__config(), data, res);
                return res.data.result;
            })
            .catch((error: any) => {
                this.__processError("__del", url, this.__config(), data, error);
                return undefined;
            });
    },

    __put(path: string, data?: any) {
        const url = this.__url(path);
        return HttpService.put(url, data, this.__config())
            .then((res: any) => {
                this.__logResult("__put", url, this.__config(), data, res);
                return res.data.result;
            })
            .catch((error: any) => {
                this.__processError("__put", url, this.__config(), data, error);
                return undefined;
            });
    },

    //------------------------------------------------------------------------------------------------------------------

    __logResult(fun: string, url: string, config: any, data: any, res: any) {
        Log.d4(
            this.TAG,
            `${fun}(${url}) request data: ${JSON.stringify(data)} response data: ${JSON.stringify(
                res
            )}`
        );
    },

    __processError(fun: string, url: string, config: any, data: any, error: any) {
        this.__logResult(fun, url, config, data, error);
        this.__showError(error);
    },

    __setError(err: string) {
        // AppStore.errorSet(err);
    },

    __formatFieldsError(err: any) {
        return Object.getOwnPropertyNames(err).reduce(
            (p, c) => `${p}${objProp(err, c)} (${c})\n\n`,
            ""
        );
    },

    __showError(error: any) {
        Log.d1(this.TAG, "error: {}", error);

        // if (error && error.response && error.response.status) {
        //     LocalStore.lastApiErrorSet(error.response.status);
        //     if (!NOT_DEFAULT_ERRORS.includes(error.response.status))
        //         if (error.response.data.error)
        //             error.response.data.error.fields
        //                 ? this.__setError(
        //                       this.__formatFieldsError(error.response.data.error.fields)
        //                   )
        //                 : this.__setError(`${error.response.data.error.message}`);
        //         else this.__setError(`${JSON.stringify(error.message)}`);
        // } else this.__setError(strings.error_unknown);
    }
}