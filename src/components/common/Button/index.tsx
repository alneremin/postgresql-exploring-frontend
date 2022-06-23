import React, {ButtonHTMLAttributes} from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick?: () => void;
    buttonRef?: any;
    tabIndex?: number;
    className?: string;
}

const Button: React.FunctionComponent<IButtonProps> = (props) => {
    const {onClick, buttonRef, tabIndex, type, className, children} = props;

    const clickHandler = () => {
        onClick && onClick();
    };

    return (
        <button
            type={type || "button"}
            tabIndex={tabIndex}
            ref={buttonRef}
            className={clsx(className, styles.button)}
            onClick={clickHandler}
        >
            {children}
        </button>
    );
};

export default Button;
