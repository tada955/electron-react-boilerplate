import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [app_model, setAppModel] = useState<HCCM_Model>(start_model);
  let ref_mod = useRef(app_model);

  async function startDB() {
    const init_db = await window.electron.initialiseDB();
    if (init_db) {
      // const new_model = app_model;
      setAppModel(init_db);
    }
  }

  useEffect(() => {
    // window.electron.ipcRenderer.clearChannel('onSaveModel');
    window.electron.onSaveModel((value) => {
      onSave();
    });
    window.electron.ipcRenderer.on('on-open-model', function(e, arg) {
      setAppModel(e);
      ref_mod.current = e;
    });
  }, []);

  async function onSave() {
    await window.electron.saveModel(ref_mod.current);
  }

  return (
    <ReactFlowProvider>
      <MemoryRouter>
        <Routes>
          <Route path="/" Component={() => <Home ref_mod={ref_mod} app_model={app_model} setAppModel={setAppModel}/>} />
        </Routes>
      </MemoryRouter>
    </ReactFlowProvider>
  );
}