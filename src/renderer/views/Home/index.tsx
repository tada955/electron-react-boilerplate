import Sidebar from '../../components/Sidebar';
import { EntityListItem } from '../../components/Sidebar';

import styles from './Home.module.css';

import { useState, useEffect } from 'react';
import EntityEditor from '../../components/EntityEditor';
import ActivityEditor from '../../components/ActivityEditor';
import Entity from '../../dataClasses/Entity';
import Activity from '../../dataClasses/Activity';
import { addActivityParticipant, addEntity, getEntity, removeActivityParticipant, removeEntity, addEventParticipant, removeEventParticipant } from '../../dataClasses/HCCMModel';

export default function Home({
  app_model,
  setAppModel
}) {

  const [entity_items, setEntityItems] = useState<EntityListItem[]>([
    {
      ent: app_model.entities[0],
      selected: false
    },
    {
      ent: app_model.entities[1],
      selected: false
    },
  ]);

  const [selectedEnt, setSelectedEnt] = useState<Entity>();
  // const [selectedAct, setSelectedAct] = useState<Activity>();
  const [selectedObj, setSelectedObj] = useState(null);
  // const [selectedEntName, setSelectedEntName] = useState<string>();
  
  function onAddEntity() {
    const numEnts = entity_items.length
    const nextId = entity_items[numEnts - 1].ent.id + 1
    const newEnt = new Entity(nextId, "Entity " + (nextId));
    const new_mod = addEntity(app_model, newEnt);
    setAppModel(new_mod);
    setEntityItems([...entity_items, {ent: newEnt, selected: false}]);
  }

  const onSelectEntity = (id: number) => {
    const newState = entity_items.map((entItem) => {
      if (entItem.ent.id === id) {
        setSelectedEnt(entItem.ent);
        // setSelectedEntName(entItem.ent.name);
        return {
          ...entItem,
          selected: true,
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
    setAppModel(newMod);
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
  }

  function onEventParticipantsChange(event) {
    const x = 1;

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
  }

  function onActivityEditorChange(event) {

  }

  return (
    <div className={styles.container}>
      <Sidebar entity_items={entity_items} onAddButton={onAddEntity} onSelection={onSelectEntity} onDelete={onDeleteEntity}/>
      <EntityEditor
        app_model={app_model}
        setAppModel={setAppModel}
        ent={selectedEnt}
        onChange={onEntityEditorChange}
        selectedObj={selectedObj}
        setSelectedObj={setSelectedObj}
      />
      <ActivityEditor
        app_model={app_model}
        setAppModel={setAppModel}
        selectedObj={selectedObj}
        setSelectedActName={setSelectedActName}
        selectedEnt={selectedEnt}
        setSelectedActParticipants={onActivityParticipantsChange}
        setSelectedEventName={setSelectedEventName}
        setSelectedEventParticipants={onEventParticipantsChange}
        onChange={onActivityEditorChange}
      />
    </div>
  );
}