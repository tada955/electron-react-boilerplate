import { useState, useId, useCallback, useRef, useEffect} from 'react';

import Activity from '../../dataClasses/Activity';
import Entity from '../../dataClasses/Entity';

import styles from './ActivityEditor.module.css';

export default function ActivityEditor({
  app_model,
  setAppModel,
  selectedObj,
  setSelectedActName,
  selectedEnt,
  setSelectedActParticipants,
  setSelectedEventName,
  setSelectedEventParticipants,
  onChange
}: {
  app_model: any;
  setAppModel: any;
  selectedObj?: any;
  setSelectedActName: (name: String) => void;
  selectedEnt?: Entity;
  setSelectedActParticipants: (event) => void;
  setSelectedEventName: (name: String) => void;
  setSelectedEventParticipants: (event) => void;
  onChange: (id: number, event) => void;
}) {

  if (selectedObj && selectedEnt) {
    const activityInputName = useId();
    const handleChange = (event) => {
      const x = 1;
    };

    if (selectedObj.hasOwnProperty('start_event')) {
      return (
        <div className={styles.container}>
          <div>
            <label>Activity Id: {selectedObj.id}</label>
          </div>
          <div>
            <label htmlFor={activityInputName}>Name: </label>
            <input id={activityInputName} name="activityName" value={selectedObj.name} onChange={(evt) => setSelectedActName(evt.target.value)}></input>
          </div>
          <fieldset>
            <legend>Participants:</legend>
            {app_model.entities.map((ent) => {
              if (ent.id === selectedEnt.id) {
                return (
                  <div>
                    <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                    <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(selectedEnt.id)} disabled></input>
                  </div>
                )
              } else return (
                <div>
                  <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                  <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(ent.id)} onChange={(evt) => setSelectedActParticipants(evt)}></input>
                </div>
                )
            })}
          </fieldset>
        </div>
      );
    } else if (selectedObj.hasOwnProperty('state_changes')) {
      return (
        <div className={styles.container}>
          <div>
            <label>Event Id: {selectedObj.id}</label>
          </div>
          <div>
            <label htmlFor={activityInputName}>Name: </label>
            <input id={activityInputName} name="activityName" value={selectedObj.name} onChange={(evt) => setSelectedEventName(evt.target.value)}></input>
          </div>
          <fieldset>
            <legend>Participants:</legend>
            {app_model.entities.map((ent) => {
              if (ent.id === selectedEnt.id) {
                return (
                  <div>
                    <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                    <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(selectedEnt.id)} disabled></input>
                  </div>
                )
              } else return (
                <div>
                  <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                  <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(ent.id)} onChange={(evt) => setSelectedEventParticipants(evt)}></input>
                </div>
                )
            })}
          </fieldset>
        </div>
      );
    } 

    
  }
  return (
    <div className={styles.container}>
      Select an activity.
    </div>
  );
}
