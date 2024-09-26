import Sidebar from '../../components/Sidebar';
import { EntityListItem } from '../../components/Sidebar';

import styles from './Home.module.css';

import { useState, useEffect, useCallback } from 'react';
import EntityEditor from '../../components/EntityEditor';
import ActivityEditor from '../../components/ActivityEditor';
import Entity from '../../dataClasses/Entity';
import Logic from '../../dataClasses/Logic';
import Activity from '../../dataClasses/Activity';
import { addActivityParticipant, addEntity, getEntity,
  removeActivityParticipant, removeEntity, addEventParticipant,
  removeEventParticipant, getEvent, addLogic, getLogic,
  removeLogic } from '../../dataClasses/HCCMModel';
import { app } from 'electron';

export default function Home({
  ref_mod,
  app_model,
  setAppModel
}) {

  var start_ent_list = [];
  if (app_model.entities.length != 0) {
    start_ent_list = app_model.entities.map((e) => {
      return {ent: e, selected: false};
    });
  }

  const [entity_items, setEntityItems] = useState<EntityListItem[]>(start_ent_list);

  const [selectedEnt, setSelectedEnt] = useState<Entity>();
  // const [selectedAct, setSelectedAct] = useState<Activity>();
  const [selectedObj, setSelectedObj] = useState(null);
  // const [selectedEntName, setSelectedEntName] = useState<string>();
  const [rfInstance, setRfInstance] = useState(null);
  
  function onAddEntity() {   

    const numEnts = entity_items.length
    var nextId = 0;
    if (numEnts === 0) {
      nextId = 1;
    } else {
      nextId = entity_items[numEnts - 1].ent.id + 1
    }

    const newEnt = new Entity(nextId, "Entity " + (nextId));
    const new_mod = addEntity(app_model, newEnt);
    setAppModel(new_mod);
    ref_mod.current = new_mod;
    setEntityItems([...entity_items, {ent: newEnt, selected: false}]);
  }

  const onSelectEntity = (id: number) => {
    const new_ins = rfInstance;
    if ((rfInstance) && (selectedEnt)) {
      app_model.entities = app_model.entities.map((a) => {
        if (a.id === selectedEnt.id) {
          return {
            ...a,
            diagram_properties: JSON.stringify(rfInstance.toObject())
          };
        } else {
          return a;
        }
      });
      setAppModel(app_model);
      ref_mod.current = app_model;
    }

    const newState = entity_items.map((entItem) => {
      if (entItem.ent.id === id) {
        setSelectedEnt(entItem.ent);
        // setSelectedEntName(entItem.ent.name);
        return {
          ...entItem,
          selected: true,
        };
      } else if ((rfInstance) && (selectedEnt) && (entItem.ent.id === selectedEnt.id)) {
        return {
          ...entItem,
          selected: false,
          ent: {
            ...entItem.ent,
            diagram_properties: JSON.stringify(rfInstance.toObject())
          }
        };
      } else {
        return {
          ...entItem,
          selected: false,
        };
      }
    });

    setEntityItems(newState);
  };

  function onDeleteEntity(id: number) {
    const new_mod = removeEntity(app_model, id);
    setAppModel(new_mod);
    ref_mod.current = new_mod;

    setEntityItems(entity_items.filter((entItem) => entItem.ent.id !== id));
    entity_items.map((entItem) => {
      if (entItem.ent.id === id) {
        if (entItem.selected === true) {
          setSelectedEnt(undefined);
        }
      }
    });
    
  }

  function onEntityEditorChange(id: number, event) {
    // setSelectedEntName(event.target.value);
    const newState = entity_items.map((entItem) => {
      if (entItem.ent.id === id) {
        const newItem = entItem;
        newItem.ent.name = event.target.value;
        return newItem;
      } else {
        return entItem;
      }
    });

    setEntityItems(newState);
  }

  function setSelectedActName(name: String) {
    // setSelectedEntName(event.target.value);
    const newAct = {...selectedObj};
    newAct.name = name;
    setSelectedObj(newAct);

    const newMod = app_model;
    newMod.activities = newMod.activities.map((a) => {
      if (a.id === newAct.id) {
        return newAct;
      } else {
        return a;
      }
    });
    newMod.events = newMod.events.map((a) => {
      if (a.id === newAct.start_event) {
        return {
          ...a,
          name: name + '_Start'
        };
      } else if (a.id === newAct.end_event) {
        return {
          ...a,
          name: name + '_End'
        };
      } else  {
        return a;
      }
    });
    setAppModel(newMod);
    ref_mod.current = newMod;
  }

  function onActivityParticipantsChange(event) {
    const x = 1;

    const ent_id = parseInt(event.target.id.split('-')[2]);
    const corr_ent = getEntity(app_model, ent_id);
    var newMod = app_model;
    if (event.target.checked === true) {
      newMod = addActivityParticipant(app_model, selectedObj, corr_ent);
    } else {
      newMod = removeActivityParticipant(app_model, selectedObj, corr_ent);
    }
    setSelectedObj({...selectedObj});
    setAppModel(newMod);
    ref_mod.current = newMod;
  }

  function onActivityTypeChange(event) {
    const rel_evt = event.target.id.split('-')[0];
    const new_type = event.target.id.split('-')[2];

    var new_evt;
    if (rel_evt === 'start') {
      new_evt = {...getEvent(app_model, selectedObj.start_event)};
    } else {
      new_evt = {...getEvent(app_model, selectedObj.end_event)};
    }

    if (new_type === 'scheduled') {
      new_evt.scheduled=true;
    } else {
      new_evt.scheduled=false;
    }

    app_model.events = app_model.events.map((a) => {
      if (a.id === new_evt.id) {
        return new_evt;
      } else {
        return a;
      }
    });

    const new_act = {...selectedObj};
    app_model.activities = app_model.activities.map((a) => {
      if (a.id === new_act.id) {
        return new_act;
      } else {
        return a;
      }
    });

    setSelectedObj(new_act);
    setAppModel(app_model);
    ref_mod.current = app_model;
  }

  function onActivityLogicChange(event) {
    const rel_evt = event.target.id.split('-')[0];
    // const new_type = event.target.id.split('-')[2];
    var new_mod = app_model

    var new_act = {...selectedObj};
    var new_evt = null;
    if (rel_evt === 'start') {
      new_evt = getEvent(new_mod, new_act.start_event);
    } else {
      new_evt = getEvent(new_mod, new_act.end_event);
    }

    if (event.target.checked) {
      const numLogs = new_mod.logic.length
      var nextId = 0;
      if (numLogs === 0) {
        nextId = 1;
      } else {
        nextId = new_mod.logic[numLogs - 1].id + 1
      }
      const new_log = new Logic(nextId, 'New Logic', new_evt.id);
      new_mod = addLogic(new_mod, new_log);
    } else {
      const cur_log = getLogic(new_mod, new_evt.logic);
      new_mod = removeLogic(new_mod, cur_log);
    }

    new_mod.activities = new_mod.activities.map((a) => {
      if (a.id === new_act.id) {
        return new_act;
      } else {
        return a;
      }
    });

    setSelectedObj(new_act);
    setAppModel(new_mod);
    ref_mod.current = new_mod;
  }

  function setSelectedEventName(name: String) {
    // setSelectedEntName(event.target.value);
    const newEvt = {...selectedObj};
    newEvt.name = name;
    setSelectedObj(newEvt);

    const newMod = app_model;
    newMod.events = newMod.events.map((a) => {
      if (a.id === newEvt.id) {
        return newEvt;
      } else {
        return a;
      }
    });
    setAppModel(newMod);
    ref_mod.current = newMod;
  }

  function onEventParticipantsChange(event) {
    const ent_id = parseInt(event.target.id.split('-')[2]);
    const corr_ent = getEntity(app_model, ent_id);
    var newMod = app_model;
    if (event.target.checked === true) {
      newMod = addEventParticipant(app_model, selectedObj, corr_ent);
    } else {
      newMod = removeEventParticipant(app_model, selectedObj, corr_ent);
    }
    setSelectedObj({...selectedObj});
    setAppModel(newMod);
    ref_mod.current = newMod;
  }

  function onEventTypeChange(event) {
    const new_type = event.target.id.split('-')[2];
    const new_obj = {...selectedObj};

    if (new_type === 'scheduled') {
      new_obj.scheduled=true;
    } else {
      new_obj.scheduled=false;
    }

    app_model.events = app_model.events.map((a) => {
      if (a.id === new_obj.id) {
        return new_obj;
      } else {
        return a;
      }
    });

    setSelectedObj(new_obj);
    setAppModel(app_model);
    ref_mod.current = app_model;
  }

  function onActivityEditorChange(event) {

  }

  return (
    <div className={styles.container}>
      <Sidebar entity_items={entity_items} onAddButton={onAddEntity} onSelection={onSelectEntity} onDelete={onDeleteEntity}/>
      <EntityEditor
        ref_mod={ref_mod}
        app_model={app_model}
        setAppModel={setAppModel}
        ent={selectedEnt}
        onChange={onEntityEditorChange}
        selectedObj={selectedObj}
        setSelectedObj={setSelectedObj}
        rfInstance={rfInstance}
        setRfInstance={setRfInstance}
      />
      <ActivityEditor
        ref_mod={ref_mod}
        app_model={app_model}
        setAppModel={setAppModel}
        selectedObj={selectedObj}
        setSelectedActName={setSelectedActName}
        selectedEnt={selectedEnt}
        setSelectedActParticipants={onActivityParticipantsChange}
        setSelectedActType={onActivityTypeChange}
        setSelectedActLogic={onActivityLogicChange}
        setSelectedEventName={setSelectedEventName}
        setSelectedEventParticipants={onEventParticipantsChange}
        setSelectedEventType={onEventTypeChange}
        onChange={onActivityEditorChange}
      />
    </div>
  );
}