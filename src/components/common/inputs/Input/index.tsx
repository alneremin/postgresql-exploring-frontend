import React, {InputHTMLAttributes, useCallback} from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

export interface IInputProps extends InputHTMLAttributes<any> {
    value?: string;
    placeholder?: string;
    inputRef?: any;
    password?: boolean;
    readOnly?: boolean;
    digitsOnly?: boolean;
    tabIndex?: number;
    onTextChange?: (text: string) => void;
    onEnterKey?: () => void;
    onArrowDownKey?: () => void;
    onArrowUpKey?: () => void;
    onClick?: () => void;
    onBlur?: () => void;
    onTab?: () => void;
    className?: string;
    label?: string;
    labelClassName?: string;
}

const Input: React.FunctionComponent<IInputProps> = (props) => {
    // const TAG = "Input";

    const {
        value,
        placeholder,
        inputRef,
        password,
        readOnly,
        digitsOnly,
        tabIndex,
        onTextChange,
        onEnterKey,
        onArrowDownKey,
        onArrowUpKey,
        onClick,
        onBlur,
        onTab,
        className,
        label,
        labelClassName,
        ...restProps
    } = props;

    const keyDownHandler = useCallback(
        (e: any) => {
            //if (e.code === constants.KEY_ENTER_NUMPAD || e.code === constants.KEY_ENTER) {
            if (e.keyCode === 13 && onEnterKey) {
                // KEY_ENTER_NUMPAD && KEY_ENTER has both key code === 13
                e.preventDefault();
                onEnterKey();
            } else if (e.keyCode === 40 && onArrowDownKey) {
                e.preventDefault();
                onArrowDownKey();
            } else if (e.keyCode === 38 && onArrowUpKey) {
                e.preventDefault();
                onArrowUpKey();
            } else if (e.keyCode === 9 && onTab) onTab();
        },
        [onArrowDownKey, onEnterKey, onTab]
    );

    const changeHandler = useCallback(
        (e: any) => {
            const value = e.target.value;
            onTextChange && onTextChange(digitsOnly ? value.replace(/\D/gi, "") : value);
        },
        [digitsOnly, onTextChange]
    );

    const input = (
        <input
            tabIndex={tabIndex || 0}
            type={password ? "password" : "text"}
            onClick={onClick}
            ref={inputRef}
            className={clsx(styles.input, className)}
            value={value}
            onKeyDown={keyDownHandler}
            onChange={changeHandler}
            onBlur={onBlur}
            placeholder={placeholder}
            readOnly={!!readOnly}
            {...restProps}
        />
    );

    return label ? (
        <label className={clsx(styles.label, labelClassName)}>
            {label}
            {input}
        </label>
    ) : (
        input
    );
};

export default Input;
