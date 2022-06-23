import axios from "axios";
import constants from "../res/constants";
import {Log} from "../utils/log";

const TAG = "HttpService";

const HttpService = axios.create({
    timeout: 30000,
});

function errorHandler(error: any) {
    Log.d2(
        TAG,
        `errorHandler() error message: ${JSON.stringify(error.message)}` +
            `response data: ${JSON.stringify(error.response.data)} config: ${JSON.stringify(
                error.config
            )}`
    );

    // LocalStore.errorSet(error.response.data.error);

    return Promise.reject(error);
}

HttpService.interceptors.response.use((res) => {
    Log.d2(
        TAG,
        `${res.config.url} config: ${JSON.stringify(res.config)} response data: ${JSON.stringify(
            res.data
        )}`
    );

    return res;
}, errorHandler);

export default HttpService;
