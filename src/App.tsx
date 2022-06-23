import './App.css';
import Table from './components/tables/Table';
import Button from './components/common/Button';
import { useInput } from "./utils/hooks";
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
// import { Document, Page } from 'react-pdf';
import { IListElement, IDatabaseStatusItem, ITablesColumns } from "./store/Interfaces";
import { Log } from "./utils/log";

import Input from './components/common/inputs/Input';
import { AppService } from './services/AppService';
import List from './components/common/List';
import Modal from './components/common/Modal';
import constants from './res/constants';

function App() {

  const [tables, setTables] = useState<ITablesColumns>()

  const [error, setError] = useState<String>("")

  const searchInput = useInput("")

  function setErrorMessage(value: String) {
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
        
    if (data)
      getDatabasesStateResponse(data)
    else {
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

  function getDatabasesStateResponse(value: IDatabaseStatusItem[]) {
    Log.d4("APP", "TablesResponse", value)
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

  const [compareDbmsList, setCompareDbmsList] = useState<IListElement[]>([{
    index: 0, isChecked: true, name: 'MySQL'},{
    index: 1, isChecked: false, name: 'PostgreSQL'},{
    index: 2, isChecked: false, name: 'MSSQL'},{
    index: 3, isChecked: false, name: 'MariaDB'
  }]);

  function dbmsOnChange(index: number) {
    return function dbmsChecked(e:any) {
      setCompareDbmsList(compareDbmsList.map((v, i) => {
        if (index === i) {
          v.isChecked = true
        } else {
          v.isChecked = false
        }
        return v
      }))
    }
  }

  const [compareMetricList, setCompareMetricList] = useState<IListElement[]>([{
    index: 0, isChecked: false, name: 'Время выполнения'},{
    index: 1, isChecked: false, name: 'Кол-во запросов'},{
      index: 1, isChecked: false, name: 'Кол-во запросов'},{
        index: 1, isChecked: false, name: 'Кол-во запросов'},{
    index: 2, isChecked: false, name: 'Индексирование'},]);

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

  const [metricList, setMetricList] = useState<IListElement[]>([{
    index: 0, isChecked: false, name: 'Время выполнения'},{
    index: 1, isChecked: false, name: 'Кол-во запросов'},{
    index: 2, isChecked: false, name: 'Индексирование'},]);
  
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

  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   // Should not ever set state during rendering, so do this in useEffect instead.
  //   setCompareDbmsList(isCheckedList);
  // }, []);

  return (

    <div className="App">
      
      <Modal
        visible={showModal}
        title={"Выберите СУБД и метрики для сравнения"}
        content={(
          <div>
            <h1 className='status-name-label'>СУБД:</h1>
            <List
            checkList={compareDbmsList}
            menuCLassName={'vmenu'}
            childrenFunc={(value: IListElement, index, array) => (
              <li>
                <span className='status-name-label'>{value.name}</span>
                <input className='status-label' type='checkbox' onChange={dbmsOnChange(index)} checked={value.isChecked}/>
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

            <div className='bottom-area'>
              <Button 
              children={"Сравнить"}
              className={'bottom-buttons'}
              onClick={() => {
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
        footer={(
         <br/>
        )}
        onClose={() => {
          setShowModal(false)
        }}
      />

      <div className='block'>
        <List
          checkList={stateList}
          menuCLassName={'menu statuses'}
          childrenFunc={(value: IDatabaseStatusItem, index, array) => (
            <li>
              <span className='status-name-label'>{value.name}</span>
              <span className='status-label' onChange={stateOnChange(index)}>{": " + value.status} </span>
            </li>
          )}
        />
        
        <div className='inline'>
          <Input 
          onChange={searchInput.onChange}
          placeholder="Введите параметры запроса"/>
          <Button 
          children={"Найти"}
          className='button-normal-width'
          onClick={() => {
            console.log(metricList)
            setShowModal(true)
          }}
          
          />
          <Button 
          children={"Начать сравнение"}
          className='button-big-width'
          onClick={() => {
            console.log(metricList)
            setShowModal(true)
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

      <header className="App-header">
        <h3>{error}</h3>
      </header>

      <Table
      columns={tables?.resultsColumns ?? []}
      data={[{databaseName: 123, metrics: "124 234 ds gsd gs", checkTime: "12-12-2012 23:23:22", results: "yes"},
      {databaseName: 312, metrics: "124 234 ds gsd gs", checkTime: "12-12-2012 23:23:22", results: "yes"}]}
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
      
    </div >

  );

}

export default App;
