import './App.css';
import Table from './components/tables/Table';
import Button from './components/common/Button';
import { useInput } from "./utils/hooks";
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
// import { Document, Page } from 'react-pdf';
import { 
  IListElement, 
  IDatabaseStatusItem, 
  ITablesColumns, 
  IMetricItem, 
  IMetricListElement, 
  IExploringResultItem,
  ICompareDatabaseItem,
  IActionListElement,
  IActionItem,
  ICompareResultItem,
 } from "./store/Interfaces";
import { Log } from "./utils/log";

import Input from './components/common/inputs/Input';
import { AppService } from './services/AppService';
import List from './components/common/List';
import Modal from './components/common/Modal';
import constants from './res/constants';

function App() {

  const [tables, setTables] = useState<ITablesColumns>()

  const [error, setError] = useState<string>("")

  const [searchText, setSearchText] = useState<string>("")

  const [queryText, setQueryText] = useState<string>("")

  function setErrorMessage(value: string) {
    setError(value)
    setTimeout(() => {
      setError("")
    }, 3000);
  }

  const base64toBlob = (data: string) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data;//substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
  };

  function getFileURL(data: string) {
    const blob = base64toBlob(data);
    return URL.createObjectURL(blob);
  }
  
  const getTables = useCallback(async () => {
    let data = await AppService.getTables({})
        
    if (data)
      getTablesResponse(data)
    else {
      setError("Ошибка получения таблиц")
    }
  }, [])

  useEffect(() => {
    getTables()
  }, [getTables]);

  const getDatabasesState = useCallback(async () => {
    let data = await AppService.getDatabasesState({})
        
    if (data) {
      getDatabasesStateResponse(data)
      getCompareDbmsResponse(data)
      getCompareListResponse(data)
    } else {
      setError("Ошибка получения состояний СУБД")
    }
  }, [])

  useEffect(() => {
        getDatabasesState();

        const timeoutCb = async () => {
            await getDatabasesState();
            clearTimeout(timeout);
            timeout = setTimeout(timeoutCb, constants.GET_DATABASE_STATE_POLL_TO);
        };

        let timeout = setTimeout(timeoutCb, constants.GET_DATABASE_STATE_POLL_TO);

        return () => clearTimeout(timeout);
  }, [getDatabasesState]);

  useEffect(() => {
    setError('');

    const timeoutCb = async () => {
        setError('')
        clearTimeout(timeout);
        timeout = setTimeout(timeoutCb, constants.SHOW_ERROR_POLL_TO);
    };

    let timeout = setTimeout(timeoutCb, constants.SHOW_ERROR_POLL_TO);

    return () => clearTimeout(timeout);
  }, [setError]);

  function getDatabasesStateResponse(value: IDatabaseStatusItem[]) {
    Log.d4("APP", "DatabasesStateResponse", value)
    setStateList(value)
  }

  function getTablesResponse(value: ITablesColumns) {
    Log.d4("APP", "TablesResponse", value)
    setTables(value)
  }

  const [tablePosition, setTablePosition] = useState(0);

  const [stateList, setStateList] = useState<IDatabaseStatusItem[]>([]);

  function stateOnChange(index: number) {
    return function dbmsChecked(e:any) {
      setStateList(stateList.map((v, i) => {
        return v
      }))
    }
  }

  const [compareDbmsList, setCompareDbmsList] = useState<ICompareDatabaseItem[]>([]);

  function getCompareDbmsResponse(value: IDatabaseStatusItem[]) {
    Log.d4("APP", "CompareDbms111", compareDbmsList)
    console.log(compareDbmsList)
    setCompareDbmsList(value.map((v, i) => {
      return {
        name: v.name,
        isChecked: compareDbmsList[i] && v.status === 'On' ? compareDbmsList[i].isChecked : false,
        checkable: v.status === 'On',
        id: v.id,
      }
    }))
  }

  function dbmsOnChange(index: number) {
    return function dbmsChecked(e:any) {
      Log.d4("APP", "CompareDbms111", compareDbmsList)
      console.log(compareDbmsList)
      setCompareDbmsList(compareDbmsList.map((v, i) => {
        if (index === i && v.checkable) {
          v.isChecked = true
        } else {
          v.isChecked = false
        }
        return v
      }))
    }
  }

  const [compareMetricList, setCompareMetricList] = useState<IMetricListElement[]>([]);

  function compareMetricOnChange(index: number) {
    return function metricChecked(e:any) {
      setCompareMetricList(compareMetricList.map((v, i) => {
        if (index === i) {
          v.isChecked = !v.isChecked
        }
        return v
      }))
    }
  }

  // let [isCheckedList, setIsCheckedList] = useState(initIsCheckedList);

  const getMetrics = useCallback(async () => {
    let data = await AppService.getMetrics({})
        
    if (data)
      getMetricsResponse(data)
    else {
      setError("Ошибка получения состояний СУБД")
    }
  }, [])

  function getMetricsResponse(value: IMetricItem[]) {
    Log.d4("APP", "MetricResponse", value)
    setMetricList(value.map(v => {
      return {
        id: v.id,
        isChecked: true,
        name: v.name
      } as IMetricListElement
    }))
    setCompareMetricList(value.map(v => {
      return {
        id: v.id,
        isChecked: true,
        name: v.name
      } as IMetricListElement
    }))
  }

  useEffect(() => { getMetrics() }, [getMetrics]);

  const [metricList, setMetricList] = useState<IMetricListElement[]>([]);
  
  function metricOnChange(index: number) {
    return function metricChecked(e:any) {
      setMetricList(metricList.map((v, i) => {
        if (index === i) {
          v.isChecked = !v.isChecked
        }
        return v
      }))
    }
  }

  const [actionList, setActionList] = useState<IActionListElement[]>([]);
  
  function actionOnChange(index: number) {
    return function actionChecked(e:any) {
      setActionList(actionList.map((v, i) => {
        if (index === i) {
          v.isChecked = !v.isChecked
        }
        return v
      }))
    }
  }

  const getActions = useCallback(async () => {
    let data = await AppService.getActions({})
        
    if (data)
      getActionsResponse(data)
    else {
      setError("Ошибка получения состояний СУБД")
    }
  }, [])

  useEffect(() => { getActions() }, [getActions]);

  function getActionsResponse(value: IActionItem[]) {
    Log.d4("APP", "MetricResponse", value)
    setActionList(value.map(v => {
      return {
        id: v.id,
        isChecked: true,
        name: v.name
      } as IActionListElement
    }))
  }

  const [showModal, setShowModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  // useEffect(() => {
  //   // Should not ever set state during rendering, so do this in useEffect instead.
  //   setCompareDbmsList(isCheckedList);
  // }, []);

  const [exploringResult, setExploringResult] = useState<IExploringResultItem[]>([]);

  const getResult = useCallback(async () => {

    const query = {
      metric: '',
      query: ''
    }
    if (metricList.length) {
      const metrics = metricList
      .filter(m => m.isChecked)
      .map(m => m.id)

      if (metrics.length) {
        query.metric = metrics.reduce((acc, val) => acc + ';' + val)
      }
    }

    if (searchText) {
      query.query = searchText
    }

    let data = await AppService.getResult(query)
        
    if (data)
      getResultResponse(data)
    else {
      setError("Ошибка получения результата")
    }
  }, [metricList, queryText])

  useEffect(() => {
    getResult();

    const timeoutCb = async () => {
        await getResult();
        clearTimeout(timeout);
        timeout = setTimeout(timeoutCb, constants.GET_DATABASE_STATE_POLL_TO);
    };

    let timeout = setTimeout(timeoutCb, constants.GET_DATABASE_STATE_POLL_TO);

    return () => clearTimeout(timeout);
}, [getResult]);

  function getResultResponse(value: IExploringResultItem[]) {
    Log.d4("APP", "ResultResponse", value)
    setExploringResult(value)
  }

  useEffect(() => { getResult() }, [getResult]);

  function analyzeDatabaseResponse(value: IExploringResultItem[]) {
    Log.d4("APP", "analyzeDatabaseResponse", value)
    setShowModal(false)
    setExploringResult(value)
  }

  const [rowCount, setRowCount] = useState(100)

  useEffect(() => { 
    if (rowCount < 1) {
      setRowCount(1)
    } else if (rowCount > 500000) {
      setRowCount(500000)
    } 
  }, [rowCount]);


  const [ compareList, setCompareList] = useState<ICompareDatabaseItem[]>([])

  function compareListOnChange(index: number) {
    return function compareListChecked(e:any) {
      let checkedCount = !compareList[index].isChecked ? 1 : 0
      setCompareList(compareList.map((v, i) => {
        if (index === i && v.checkable) {
          v.isChecked = !v.isChecked
        } else if (checkedCount > 1) {
          v.isChecked = false
        } else if (v.isChecked) {
          checkedCount++
        }
        return v
      }))
    }
  }

  function getCompareListResponse(value: IDatabaseStatusItem[]) {
    Log.d4("APP", "compareList", value)
    setCompareList(value.map((v, i) => {
      return {
        name: v.name,
        isChecked: compareList[i] && v.status === 'On' ? compareList[i].isChecked : false,
        checkable: v.status === 'On',
        id: v.id,
      }
    }))
  }



  
  const [compareResult, setCompareResult] = useState<ICompareResultItem[]>([]);

  const getCompareResult = useCallback(async () => {

    console.log(compareList)
    if (compareList.filter(cl => cl.isChecked).length < 2) {
      setError('Выберите СУБД для сравнения')
      return
    }
    console.log({
      databaseIds: compareList.filter(cl => cl.isChecked).map(cl => cl.id)
    })
    let data = await AppService.compareDatabase({
      databaseIds: compareList.filter(cl => cl.isChecked).map(cl => cl.id)
    })
        
    if (data)
      getCompareResultResponse(data)
    else {
      setError("Ошибка получения результата")
    }
  }, [compareList])

  function getCompareResultResponse(value: ICompareResultItem[]) {
    Log.d4("APP", "CompareResultResponse", value)

    if (tables?.compareColumns) {
      const dbms1Number = tables.compareColumns.length - 2
      tables.compareColumns[dbms1Number].name = value[0].dbmsName1 ??  
        tables.compareColumns[dbms1Number].name
        const dbms2Number = tables.compareColumns.length - 1
      tables.compareColumns[dbms2Number].name = value[0].dbmsName2 ??
        tables.compareColumns[dbms2Number].name
    }
    
    setTables({
      resultsColumns: tables?.resultsColumns ?? [],
      compareColumns: tables?.compareColumns ?? []
    })
    setCompareResult(value)
  }

  const [compareCurrentPosition, setCompareCurrentPosition,] = useState(0);

  return (

    <div className="App">
      
      {analyzeModal(
        showModal, 
        compareDbmsList,
        dbmsOnChange,
        compareMetricList,
        compareMetricOnChange,
        setShowModal,
        setError,
        analyzeDatabaseResponse,
        error,
        actionList,
        actionOnChange,
        rowCount,
        setRowCount,
        'modal-analyze',
      )}

      {compareModal(
        showCompareModal, 
        compareList,
        compareListOnChange,
        tables,
        setShowCompareModal,
        error,
        'modal-compare',
        compareResult,
        getCompareResult,
        compareCurrentPosition,
        setCompareCurrentPosition,
      )}

      <div className='block'>
        <List
          checkList={stateList}
          menuCLassName={'menu statuses'}
          childrenFunc={(value: IDatabaseStatusItem, index, array) => (
            <li>
              <span className='status-name-label'>{value.name}</span>
              <span 
              className={value.status === 'On' ? 'status-green-label' : 'status-red-label'} 
              onChange={stateOnChange(index)}>{": " + value.status} </span>
            </li>
          )}
        />
        
        <div className='inline'>
          <Input 
          onTextChange={setSearchText}
          onEnterKey={() => {
            setQueryText(searchText)
          }}
          placeholder="Введите параметры запроса"/>
          <Button 
          children={"Найти"}
          className='button-normal-width'
          onClick={() => {
            setQueryText(searchText)
          }}
          
          />
          <Button 
          children={"Анализ"}
          className='button-normal-width'
          onClick={() => {
            console.log(metricList)
            setShowModal(true)
          }}
          />

          <Button 
          children={"Сравнить"}
          className='button-big-width'
          onClick={() => {
            setShowCompareModal(true)
          }}
          />
        </div>
        <List
          checkList={metricList}
          menuCLassName={'menu statuses'}
          childrenFunc={(value: IListElement, index, array) => (
            <li>
              <span className='status-name-label'>{value.name}</span>
              <input className='status-label' type='checkbox' onChange={metricOnChange(index)} checked={value.isChecked}/>
            </li>
          )}
        />
      
      </div>

      <Table
      columns={tables?.resultsColumns ?? []}
      data={exploringResult}
      viewportWidth={1000}
      viewportHeight={300}
      rowHeight={40}
      rowsPerPage={200}
      currentPosition={tablePosition}
      selectable={true}
      onCurrentPositionChange={(data, index) => {
        setTablePosition(index)
      }}
      />
      <br/>
      <br/>
      
      <header className="App-header">
        <h5>{error}</h5>
      </header>

    </div >

  );

}

function analyzeModal(
  showModal:boolean, 
  compareDbmsList:ICompareDatabaseItem[],
  dbmsOnChange:any,
  compareMetricList:IMetricListElement[],
  compareMetricOnChange:any,
  setShowModal:any,
  setError:any,
  analyzeDatabaseResponse:any,
  error:any,
  actionList:any,
  actionOnChange:any,
  rowCount:number,
  setRowCount:any,
  modalClassname:any,
  ) {
  return (
    <Modal
    visible={showModal}
    className={modalClassname}
    title={"Выберите СУБД и метрики для анализа"}
    content={(
      <div>
        <h1 className='status-name-label'>СУБД:</h1>
        <List
        checkList={compareDbmsList}
        menuCLassName={'vmenu'}
        childrenFunc={(value: ICompareDatabaseItem, index, array) => (
          <li>
            <span 
            className={'status-name-label ' + (value.checkable ? '': 'status-off')} >{value.name}</span>
            <input className='status-labels'
            type='checkbox' 
            onChange={dbmsOnChange(index)} 
            checked={value.isChecked}/>
          </li>
        )}
        />

        <h1 className='status-name-label'>Метрики:</h1>
        <List
        checkList={compareMetricList}
        menuCLassName={'menu-modal'}
        childrenFunc={(value: IListElement, index, array) => (
          <li>
            <span className='status-name-label'>{value.name}</span>
            <input className='status-label' type='checkbox' onChange={compareMetricOnChange(index)} checked={value.isChecked}/>
          </li>
        )}
        />

        <h1 className='status-name-label'>Вид запроса:</h1>
        <List
        checkList={actionList}
        menuCLassName={'menu-modal'}
        childrenFunc={(value: IListElement, index, array) => (
          <li>
            <span className='status-name-label'>{value.name}</span>
            <input className='status-label' type='checkbox' onChange={actionOnChange(index)} checked={value.isChecked}/>
          </li>
        )}
        />

        <h1 className='status-name-label'>Кол-во записей:</h1>
          <Input 
          onTextChange={setRowCount}
          inputType='number'
          value={rowCount}
          placeholder="Введите любое натуральное число"/> 

      </div>
    )}
    footer={(
      <div className='inline'>
      <div className='status-red-label'>{error}</div>
      <div className='bottom-area'>
      <Button 
      children={"Анализ"}
      className={'bottom-buttons'}
      onClick={() => {
        analyzeDatabase(
          compareDbmsList, 
          compareMetricList, 
          setError, 
          analyzeDatabaseResponse,
          actionList,
          rowCount)
      }}/>
      <Button 
      children={"Закрыть"}
      className={'bottom-buttons'}
      onClick={() => {
        setShowModal(false)
      }}/>
    </div>
    </div>
    )}
    onClose={() => {
      setShowModal(false)
    }}
  />
  )
}

async function analyzeDatabase(
  compareDbmsList:ICompareDatabaseItem[],
  compareMetricList:IMetricListElement[],
  setError:any,
  analyzeDatabaseResponse:any,
  actionList:IActionListElement[],
  rowCount:number
  ) {
    
    const body = {
      metricIds: compareMetricList.filter(m => m.isChecked).map(m => m.id),
      databaseIds: compareDbmsList.filter(m => m.isChecked).map(m => m.id),
      actionIds: actionList.filter(m => m.isChecked).map(m => m.id),
      rowCount
    }

    if (!body.metricIds.length) {
      return setError("Выберите метрику!")
    } else if (!body.databaseIds.length) {
      return setError("Выберите СУБД!")
    } else if (!body.actionIds.length) {
      return setError("Выберите действие!")
    }

    let data = await AppService.analyzeDatabase(body)
    
    if (data) {
      analyzeDatabaseResponse(data)
    } else {
      setError("Ошибка анализа СУБД")
    }
}

function compareModal(
  showCompareModal:boolean, 
  compareList:ICompareDatabaseItem[],
  compareListOnChange:any,
  tables:any,
  setShowCompareModal:any,
  error:any,
  modalClassname:any,
  compareResult:any,
  getCompareResult:any,
  compareCurrentPosition:any,
  setCompareCurrentPosition:any
  ) {

  return (
    <Modal
    visible={showCompareModal}
    title={"Выберите СУБД для сравнения"}
    className={modalClassname}
    content={(
      <div>
        <List
        checkList={compareList}
        menuCLassName={'menu-modal'}
        childrenFunc={(value: ICompareDatabaseItem, index, array) => (
          <li>
            <span 
            className={'status-name-label ' + (value.checkable ? '': 'status-off')} >{value.name}</span>
            <input className='status-labels'
            type='checkbox' 
            onChange={compareListOnChange(index)} 
            checked={value.isChecked}/>
          </li>
        )}
        />

      <Table
      columns={tables?.compareColumns ?? []}
      data={compareResult}
      viewportWidth={1000}
      viewportHeight={300}
      rowHeight={40}
      rowsPerPage={200}
      currentPosition={compareCurrentPosition}
      selectable={true}
      onCurrentPositionChange={(data, index) => {
        setCompareCurrentPosition(index)
      }}
      />
       
      </div>
    )}
    footer={(
      <div className='inline'>
      <div className='status-red-label'>{error}</div>
      <div className='bottom-area'>
      <Button 
      children={"Сравнить"}
      className={'bottom-buttons'}
      onClick={() => {
        getCompareResult()
      }}/>
      <Button 
      children={"Закрыть"}
      className={'bottom-buttons'}
      onClick={() => {
        setShowCompareModal(false)
      }}/>
    </div>
    </div>
    )}
    onClose={() => {
      setShowCompareModal(false)
    }}
  />
  )
}

export default App;
