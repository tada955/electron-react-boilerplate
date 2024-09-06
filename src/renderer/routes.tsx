import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react'

import Home from './views/Home';
import Entity from './dataClasses/Entity';
import HCCM_Model from './dataClasses/HCCMModel';

class appState {
  model: HCCM_Model;
  constructor(model=new HCCM_Model()) {
    this.model=model;
  }
};

export default function appRoutes() {

  const start_model = new HCCM_Model();
  const defaultEntity = new Entity(5, 'Entity Test 5');
  start_model.entities.push(defaultEntity);
  start_model.entities.push(new Entity(6, 'Entity Test 6'));
  // const defaultEntity = new Entity(4, 'Entity Test 4');
  // start_model.entities.push(defaultEntity);

  const [app_model, setAppModel] = useState<HCCM_Model>(start_model);

  async function startDB() {
    const init_db = await window.electron.initialiseDB();
    if (init_db) {
      // const new_model = app_model;
      setAppModel(init_db);
    }
  }

  useEffect(() => {
    startDB();
  }, []);

  return (
    <ReactFlowProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" Component={() => <Home app_model={app_model} setAppModel={setAppModel}/>} />
        </Routes>
      </MemoryRouter>
    </ReactFlowProvider>
  );
}