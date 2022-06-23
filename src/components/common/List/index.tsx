import clsx from "clsx";
import React from "react";
import './index.scss'

export interface IListProps {
    onClick?: () => void;
    checkList: any[];
    className?: string;
    menuCLassName?: string;
    childrenFunc: (value: any, index: number, array: any[]) => any;
}

const List: React.FunctionComponent<IListProps> = (props) => {
    const {onClick, menuCLassName, className, childrenFunc, checkList} = props;


    return (
        <div 
        className={clsx(menuCLassName, className)}>
        <ul>
        {checkList.map(childrenFunc)}
        </ul>
        </div>
    );
};

export default List;
