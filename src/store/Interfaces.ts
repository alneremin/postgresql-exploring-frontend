export { }

export interface ISearchRegistryItemRequest {
  surname: String,
  name: String,
  patrname: String,
  birthdate: String
}

export interface IGetContentRequest {
  amdId: String,
}

export interface IDatabaseStatusItem {
  name: String,
  status: String,
  id: String,
}

export interface ICompareDatabaseItem {
  name: String,
  id: String,
  isChecked: boolean,
  checkable: boolean
}

export interface IMetricItem {
  id: String,
  name: String,
  type: String,
}

export interface IExploringResultItem {
  databaseId: String,
  metricId: String,
  databaseName: String,
  metricName: String,
  createDate: String,
  metricValue: String,
  status: String,
}

export interface IAnalyzeDatabaseRequest {
  metricIds: string[],
  databaseIds: string[],
}

export interface IGetContentItem {
  data: String,
  type: String,
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
}

export interface ITablesColumns {
  resultsColumns: ITableColumn[];
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