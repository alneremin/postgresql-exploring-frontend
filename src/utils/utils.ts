
import constants from "../res/constants";
import {Log} from "./log";


const TAG = "Utils";

export const screenWidth = (): number => window.innerWidth;

export const screenHeight = (): number => window.innerHeight;

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const showAlert = (text: string) => window.alert(text);

export const isWindows = () => window.navigator.platform.match(/win/gi);

export const isNull = (obj: any) =>
    obj === undefined || obj === null || obj === "undefined" || obj === "null";

export const isNotNull = (obj: any) => !isNull(obj);

export const isNullOrEmpty = (obj: any) => isNull(obj) || obj === "";

export const isNotNullOrEmpty = (obj: any) => isNotNull(obj) && obj !== "";

export const objProp = (obj: any, prop: string) => obj[prop];

export const setObjProp = (obj: any, prop: string, value: any) => (obj[prop] = value);
