import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {ITableColumn, ITableColumnHeader} from "../../../store/Interfaces";
import {VariableSizeGrid as Grid} from "react-window";
import dimens from "../../../res/dimens";
import colors from "../../../res/colors";
import constants from "../../../res/constants";
import {sleep} from "../../../utils/utils";
import {Log} from "../../../utils/log";
import {useDebug} from "../../../utils/hooks";
import styles from "./styles.module.scss";

interface ITableProps {
    columns: ITableColumn[];
    data: any[];
    viewportWidth: number;
    viewportHeight: number;
    rowHeight: number;
    rowsPerPage: number;
    currentPosition: number;
    onCurrentPositionChange?: (data: any, index: number) => void;
    extRef?: any;
    onEnterPress?: (data: any) => void;
    onClick?: () => void;
    rowBackgroundColor?: (data: any, current: boolean, selected: boolean) => string;
    selectable?: boolean;
    selection?: number[];
    onSelectionChange?: (selection: number[]) => void;
    singleSelection?: boolean;
    onColumnHeaderClick?: (header: ITableColumnHeader) => void;
    sortColumnIndex?: number;
    sortColumnTypeAsc?: boolean;
    textSize?: number;
}

export interface ICell {
    columnIndex: number;
    rowIndex: number;
    style: any;
}

export interface ITableScrollInfo {
    scrollLeft: number;
    scrollTop: number;
    scrollUpdateWasRequested: boolean;
}

const Table: React.FunctionComponent<ITableProps> = (props) => {
    const TAG = "Table";

    const {
        columns,
        data,
        viewportWidth,
        viewportHeight,
        rowHeight,
        rowsPerPage,
        extRef,
        onEnterPress,
        onClick,
        currentPosition,
        onCurrentPositionChange,
        rowBackgroundColor,
        selectable,
        selection,
        onSelectionChange,
        singleSelection,
        onColumnHeaderClick,
        sortColumnIndex,
        sortColumnTypeAsc,
        textSize
    } = props;

    const [leftPosition, setLeftPosition] = useState(0);

    const tableRef = useRef<any>(null);
    const headerRef = useRef<any>(null);
    const gridRef = useRef<any>(null);

    useDebug(TAG, "table columns", columns);
    useDebug(TAG, "table data", data);

    const showHeaderScrollbar = useMemo(() => {
        return (
            Math.trunc((viewportHeight - constants.TABLE_SCROLLBAR_SIZE) / rowHeight) < data.length
        );
    }, [data, viewportHeight, rowHeight]);

    const setSelection = useCallback(
        (selection: number[]) => {
            onSelectionChange && onSelectionChange(selection);
        },
        [onSelectionChange]
    );
    
    const [currentColor, setCurrentColor] = useState('#123456');

    const updateCurrentPosition = useCallback(
        (index: number) => {
            onCurrentPositionChange &&
                onCurrentPositionChange(
                    index >= 0 && index < data.length ? data[index] : null,
                    index
                );
        },
        [data, onCurrentPositionChange]
    );

    useEffect(() => {
        let index: number;
        if (data.length > 0) {
            if (currentPosition >= data.length - 1) index = data.length - 1;
            else if (currentPosition <= 0) index = 0;
            else index = currentPosition;
        } else index = -1;
        updateCurrentPosition(index);
    }, [data, currentPosition]); // do not add updateCurrentPosition in deps 21.05.2021 v0.0.93

    const updateSelection = useCallback(
        (index: number) => {
            const rowIndex = index > -1 ? index : currentPosition;
            if (selection && selection.includes(rowIndex))
                setSelection(selection.filter((i) => i !== rowIndex));
            else setSelection(singleSelection ? [rowIndex] : [rowIndex, ...(selection || [])]);

            updateCurrentPosition(currentPosition + 1);
        },
        [currentPosition, selection, setSelection, singleSelection, data.length]
    );

    const columnsWidth = useMemo(() => columns.reduce((p, c) => p + (c.hidden ? 0 : c.width), 0), [columns]);

    const horizontalScrollSize = useMemo(() => columnsWidth / 10, [columnsWidth]);

    const onTableKeyDown = useCallback(
        async (key: string, ctrl: boolean, shift: boolean) => {
            switch (key) {
                case constants.KEY_ARROW_UP:
                    if (currentPosition > 0) {
                        // do not remove, break cycling
                        await sleep(constants.TABLE_VERTICAL_SCROLLING_TIMEOUT);
                        updateCurrentPosition(currentPosition - 1);
                    }
                    break;
                case constants.KEY_ARROW_DOWN:
                    if (currentPosition < data.length - 1) {
                        // do not remove, break cycling
                        await sleep(constants.TABLE_VERTICAL_SCROLLING_TIMEOUT);
                        updateCurrentPosition(currentPosition + 1);
                    }
                    break;
                case constants.KEY_ARROW_LEFT:
                    const lValue = leftPosition - horizontalScrollSize;
                    setLeftPosition(lValue < 0 ? 0 : lValue);
                    break;
                case constants.KEY_ARROW_RIGHT:
                    const rValue = leftPosition + horizontalScrollSize;
                    setLeftPosition(
                        rValue > columnsWidth - viewportWidth
                            ? columnsWidth - viewportWidth
                            : rValue
                    );
                    break;
                case constants.KEY_PAGE_UP:
                    const rowUp = currentPosition - rowsPerPage;
                    updateCurrentPosition(rowUp > 0 ? rowUp : 0);
                    break;
                case constants.KEY_PAGE_DOWN:
                    const rowDown = currentPosition + rowsPerPage;
                    updateCurrentPosition(rowDown < data.length ? rowDown : data.length - 1);
                    break;
                case constants.KEY_END:
                    updateCurrentPosition(data.length - 1);
                    break;
                case constants.KEY_HOME:
                    updateCurrentPosition(0);
                    break;
                case constants.KEY_ENTER:
                case constants.KEY_ENTER_NUMPAD:
                    if (selectable && ctrl) updateSelection(-1);
                    else if (selectable && shift) setSelection([]);
                    else if (onEnterPress) {
                        Log.d(TAG, `updateSelection() active row index:${currentPosition}`);
                        onEnterPress(data[currentPosition]);
                    }
                    break;
            }
        },
        [
            currentPosition,
            data,
            horizontalScrollSize,
            leftPosition,
            onEnterPress,
            rowsPerPage,
            selectable,
            setSelection,
            updateSelection,
            viewportWidth
        ]
    );

    useEffect(() => {
        onSelectionChange && onSelectionChange(selection || []);

        Log.d(TAG, "onSelectionChange() selection:{}", selection);
    }, [onSelectionChange, selection]);

    useEffect(() => {
        Log.d(TAG, `current index:${currentPosition}`);

        gridRef.current &&
            gridRef.current.scrollToItem({
                rowIndex: currentPosition
            });
    }, [currentPosition]);

    useEffect(() => {
        tableRef.current &&
            tableRef.current.scrollTo({
                left: leftPosition,
                behavior: "auto"
            });
    }, [leftPosition]);

    const tableScrollHandler = useCallback(
        (scrollInfo: ITableScrollInfo) => {
            if (headerRef.current) {
                headerRef.current.scrollTo({
                    left: scrollInfo.scrollLeft,
                    behavior: "auto"
                });
            }
        },
        [headerRef]
    );

    const getRowColor = useCallback(
        (index: number) => {
            return rowBackgroundColor
                ? rowBackgroundColor(
                      data[index],
                      currentPosition === index,
                      selection !== undefined && selection.includes(index)
                  )
                : currentPosition === index
                ? colors.rowBackground.current
                : colors.darkGray;
        },
        [data, selection, rowBackgroundColor, currentPosition]
    );

    const rowClick = useCallback(
        (index: number, ctrl: boolean) => {
            updateCurrentPosition(index);
            if (ctrl) updateSelection(index);
        },
        [updateCurrentPosition, updateSelection]
    );

    const cellClickHandler = useCallback(
        (index: number, ctrl: boolean) => {
            rowClick(index, ctrl);
        },
        [rowClick]
    );

    const cellDoubleClickHandler = useCallback(
        async (index: number, ctrl: boolean, shift: boolean) => {
            rowClick(index, ctrl);
            await onTableKeyDown(constants.KEY_ENTER, ctrl, shift);
        },
        [rowClick, onTableKeyDown]
    );

    const HeaderCell = useCallback(
        (cell: ICell) => (
            <div
                style={{
                    //width: columns[cell.columnIndex].width,
                    ...cell.style,
                    backgroundColor: colors.barBackground,
                    padding: dimens.spacer4,
                    paddingLeft: dimens.spacer2,
                    textAlign: "center",
                    fontWeight: "bold",
                    cursor: "default",
                    fontSize: textSize || undefined
                }}
                onClick={() =>
                    onColumnHeaderClick &&
                    onColumnHeaderClick({
                        index: cell.columnIndex,
                        name: columns[cell.columnIndex].name,
                        propertyName: columns[cell.columnIndex].propertyName
                    })
                }
                hidden={columns[cell.columnIndex].hidden}
            >
                <div
                    style={{
                        //width: columns[cell.columnIndex].width,
                        borderRight: `1px solid ${colors.darkGray}`,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                >
                    {`${columns[cell.columnIndex].name}`}
                </div>
            </div>
        ),
        [columns, onColumnHeaderClick, sortColumnIndex, sortColumnTypeAsc]
    );

    const TableCell = useCallback(
        (cell: ICell) => (
            <div
                style={{
                    //width: columns[cell.columnIndex].width,
                    ...cell.style,
                    backgroundColor: getRowColor(cell.rowIndex),
                    padding: dimens.spacer4,
                    textAlign:
                        columns[cell.columnIndex].propertyName === "product" ||
                        columns[cell.columnIndex].alignLeft
                            ? "left"
                            : "center",
                    cursor: "default",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: textSize || undefined
                }}
                onDoubleClick={(event) =>
                    cellDoubleClickHandler(cell.rowIndex, event.ctrlKey, event.shiftKey)
                }
                onClick={(event) => cellClickHandler(cell.rowIndex, event.ctrlKey)}
                className={"notSelectableText"}
                hidden={columns[cell.columnIndex].hidden}
            >
                {columns[cell.columnIndex].type === constants.TABLE_VALUE_TYPE_BOOL &&
                data[cell.rowIndex][columns[cell.columnIndex].propertyName] === true
                    ? "✔"
                    : ""}
                {columns[cell.columnIndex].type !== constants.TABLE_VALUE_TYPE_BOOL &&
                    data[cell.rowIndex][columns[cell.columnIndex].propertyName]}
            </div>
        ),
        [columns, getRowColor, data, cellDoubleClickHandler, cellClickHandler]
    );

    const columnWidthHandler = useCallback((index: number) => columns[index].hidden ? 0 : columns[index].width, [columns]);

    return (
        <div
            className={styles.tableContainer}
            tabIndex={0}
            onKeyDown={(e) => onTableKeyDown(e.key, e.ctrlKey, e.shiftKey)}
            ref={extRef}
            onClick={onClick}
        >
            <Grid
                style={{
                    width: "100%",
                    overflowX: "hidden",
                    overflowY: "hidden"
                }}
                outerRef={headerRef}
                columnCount={columns.length}
                columnWidth={columnWidthHandler}
                height={rowHeight}
                rowCount={1}
                rowHeight={() => rowHeight}
                width={viewportWidth}
            >
                {HeaderCell}
            </Grid>

            {columns.length > 0 && (
                <Grid
                    style={{
                        width: "100%"
                    }}
                    ref={gridRef}
                    outerRef={tableRef}
                    onScroll={tableScrollHandler}
                    columnCount={columns.length}
                    columnWidth={columnWidthHandler}
                    height={viewportHeight}
                    rowCount={data.length}
                    rowHeight={() => rowHeight}
                    width={viewportWidth}
                >
                    {TableCell}
                </Grid>
            )}
        </div>
    );
};

export default Table;
