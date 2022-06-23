import React, {useCallback, useState} from "react";
import {IInputProps} from "../Input";
import InputMask from 'react-input-mask';
import colors from "../../../../res/colors";
import dimens from "../../../../res/dimens";
import styles from "./styles.module.scss";

interface IDateTimeInputProps extends IInputProps {}

const DateTimeInput: React.FunctionComponent<IDateTimeInputProps> = (props) => {
    const {value, onTextChange, onClick, inputRef} = props;

    const valueChangeHandler = useCallback(
        (e: any) => {
            onTextChange && onTextChange(e.target.value);
        },
        [onTextChange]
    );

    const [focused, setFocused] = useState(false);

    return (
        <InputMask
            tabIndex={0}
            className={"input"}
            style={{
                height: dimens.input_height,
                borderRadius: 6,
                border: `1px solid ${focused ? colors.primaryGreen : colors.lightGray}`,
                paddingRight: dimens.spacer8,
                paddingLeft: dimens.spacer8,
                fontSize: dimens.text_size_normal
            }}
            mask="99.99.9999 99:99"
            placeholder={props.placeholder}
            onChange={valueChangeHandler}
            value={value}
            ref={inputRef}
            alwaysShowMask={true}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onClick={onClick}
        />
    );
};

export default DateTimeInput;
