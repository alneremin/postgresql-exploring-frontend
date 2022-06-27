export { }

export interface ISearchRegistryItemRequest {
  surname: string,
  name: string,
  patrname: string,
  birthdate: string
}

export interface IGetContentRequest {
  amdId: string,
}

export interface IDatabaseStatusItem {
  name: string,
  status: string,
  id: string,
}

export interface ICompareDatabaseItem {
  name: string,
  id: string,
  isChecked: boolean,
  checkable: boolean
}

export interface IMetricItem {
  id: string,
  name: string,
  type: string,
}

export interface IActionItem {
  id: string,
  name: string,
}

export interface IExploringResultItem {
  databaseId: string,
  metricId: string,
  databaseName: string,
  metricName: string,
  createDate: string,
  metricValue: string,
  status: string
}

export interface ICompareResultItem {
  metric: string,
  action: string,
  rowCount: string,
  dbInfo: IDatabaseInfoItem[],
}

export interface IDatabaseInfoItem {
  dbmsValue: string,
  dbmsId: string,
  dbmsName: string,
}

export interface IAnalyzeDatabaseRequest {
  metricIds: string[],
  databaseIds: string[],
}

export interface ICompareDatabaseRequest {
  databaseIds: string[],
}

export interface IGetContentItem {
  data: string,
  type: string,
}

export enum DialogResultCode {
  OK, // OK button and result OK
  YES, // YES button
  NO, // NO button
  ERROR, // OK button but operation error
  CANCEL,

  UNSATISFIED_REQUEST_SEARCH_PRODUCT,

  QUESTION
}

export interface IDialogResult {
  code: DialogResultCode;
  error?: string | undefined;
  value?: number;
}
export interface IDialogResultProps {
  onResult: (result: IDialogResult) => void;
  onCancel: () => void;
}

export interface ITableColumn {
  name: string;
  propertyName: string;
  width: number;
  order: number;
  type: string;
  alignLeft?: boolean;
  hidden?: boolean;
}

export interface ITablesColumns {
  resultsColumns: ITableColumn[];
  compareColumns: ITableColumn[];
}

export interface ITableColumnHeader {
  index: number;
  name: string;
  propertyName: string;
}

export interface IListElement {
  index: number;
  isChecked: boolean;
  name: string;
}

export interface IMetricListElement {
  id: string;
  isChecked: boolean;
  name: string;
}

export interface IActionListElement {
  id: string;
  isChecked: boolean;
  name: string;
}