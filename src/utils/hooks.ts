import React, { useState, useEffect } from 'react';
import {Log} from "./log";

// Creating a custom hook
export function useInput(defaultValue: any) {
    const [value, setValue] = useState(defaultValue);
    function onChange(e: any) {
        console.log(value)
        setValue(e.target.value);
    }

    return {
        value,
        onChange,
    };
}

export const useDebug = (tag: string, name: string, data: any) =>
    useEffect(() => {
        Log.d1(tag, `${name}: {}`, data);
    });