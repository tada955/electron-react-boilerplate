import { useState, useId, useCallback, useRef, useEffect} from 'react';

import Activity from '../../dataClasses/Activity';
import Entity from '../../dataClasses/Entity';

import styles from './ActivityEditor.module.css';
import { getEvent } from '../../dataClasses/HCCMModel';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function onChangeAce(newValue) {
  console.log("change", newValue);
}

export default function ActivityEditor({
  ref_mod,
  app_model,
  setAppModel,
  selectedObj,
  setSelectedActName,
  selectedEnt,
  setSelectedActParticipants,
  setSelectedActType,
  setSelectedActLogic,
  setSelectedEventName,
  setSelectedEventParticipants,
  setSelectedEventType,
  onChange
}: {
  ref_mod: any;
  app_model: any;
  setAppModel: any;
  selectedObj?: any;
  setSelectedActName: (name: String) => void;
  selectedEnt?: Entity;
  setSelectedActParticipants: (event) => void;
  setSelectedActType: (event) => void;
  setSelectedActLogic: (event) => void;
  setSelectedEventName: (name: String) => void;
  setSelectedEventParticipants: (event) => void;
  setSelectedEventType: (event) => void;
  onChange: (id: number, event) => void;
}) {

  if (selectedObj && selectedEnt) {
    // const activityInputName = useId();
    const handleChange = (event) => {
      const x = 1;
    };

    if (selectedObj.hasOwnProperty('start_event')) {
      const start_evt = getEvent(app_model, selectedObj.start_event);
      const end_evt = getEvent(app_model, selectedObj.end_event);

      var start_log = <div className={styles['logic-area']}></div>
      if (start_evt.logic > 0) {
        start_log = <AceEditor
                  mode="java"
                  theme="github"
                  fontSize={14}
                  width='100%'
                  height='200px'
                  onChange={onChangeAce}
                  name="start_logic_editor"
                  editorProps={{ $blockScrolling: true }}
                />
      }

      var end_log = <div className={styles['logic-area']}></div>
      if (end_evt.logic > 0) {
        end_log = <AceEditor
                  mode="java"
                  theme="github"
                  fontSize={14}
                  width='100%'
                  height='200px'
                  onChange={onChangeAce}
                  name="end_logic_editor"
                  editorProps={{ $blockScrolling: true }}
                />
      }

      return (
        <div className={styles.container}>
          <div className={styles['id-container']}>
            <label>Activity Id: {selectedObj.id}</label>
          </div>
          <div className={styles['name-container']}>
            <label htmlFor={'activity-name-' + selectedObj.id}>Name: </label>
            <input id={'activity-name-' + selectedObj.id} name="activityName" value={selectedObj.name} onChange={(evt) => setSelectedActName(evt.target.value)}></input>
          </div>
          <fieldset className={styles['participants-field']}>
            <legend>Participants:</legend>
            {app_model.entities.map((ent) => {
              if (ent.id === selectedEnt.id) {
                return (
                  <div className={styles['participant-container']} key={ent.id}>
                    <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                    <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(selectedEnt.id)} disabled></input>
                  </div>
                )
              } else return (
                <div className={styles['participant-container']} key={ent.id}>
                  <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                  <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(ent.id)} onChange={(evt) => setSelectedActParticipants(evt)}></input>
                </div>
                )
            })}
          </fieldset>
          <fieldset className={styles['participants-field']}>
            <legend>Start Event - {selectedObj.name}_Start:</legend>
            <div className={styles['type-container']}>
              <label className={styles['type-label']}>Type: </label>
              <input className={styles['type-button']} id={'start-type-scheduled'} name={'start-type'} type="radio" checked={start_evt.scheduled} onChange={(evt) => setSelectedActType(evt)}></input>
              <label className={styles['type-button-label']} htmlFor={'start-type-scheduled'}>Scheduled</label>
              <input className={styles['type-button']} id={'start-type-controlled'} name={'start-type'} type="radio" checked={!start_evt.scheduled} onChange={(evt) => setSelectedActType(evt)}></input>
              <label className={styles['type-button-label']} htmlFor={'start-type-controlled'}>Controlled</label>
            </div>
            <div className={styles['participant-container']}>
                <label htmlFor={'start-event-logic'}>Start Logic: </label>
                <input id={'start-event-logic'} name={'start-event-logic-name'} type="checkbox" checked={start_evt.logic > 0} onChange={(evt) => setSelectedActLogic(evt)}></input>
            </div>
            {start_log}
          </fieldset>
          <fieldset className={styles['participants-field']}>
            <legend>End Event - {selectedObj.name}_End:</legend>
            <div className={styles['type-container']}>
              <label className={styles['type-label']}>Type: </label>
              <input className={styles['type-button']} id={'end-type-scheduled'} name={'end-type'} type="radio" checked={end_evt.scheduled} onChange={(evt) => setSelectedActType(evt)}></input>
              <label className={styles['type-button-label']} htmlFor={'end-type-scheduled'}>Scheduled</label>
              <input className={styles['type-button']} id={'end-type-controlled'} name={'end-type'} type="radio" checked={!end_evt.scheduled} onChange={(evt) => setSelectedActType(evt)}></input>
              <label className={styles['type-button-label']} htmlFor={'end-type-controlled'}>Controlled</label>
            </div>
            <div className={styles['participant-container']}>
                <label htmlFor={'end-event-logic'}>End Logic: </label>
                <input id={'end-event-logic'} name={'end-event-logic-name'} type="checkbox" checked={end_evt.logic > 0} onChange={(evt) => setSelectedActLogic(evt)}></input>
            </div>
            {end_log}
          </fieldset>
        </div>
      );
    } else if (selectedObj.hasOwnProperty('state_changes')) {
      return (
        <div className={styles.container}>
          <div className={styles['id-container']}>
            <label>Event Id: {selectedObj.id}</label>
          </div>
          <div className={styles['name-container']}>
            <label htmlFor={'event-name-' + selectedObj.id}>Name: </label>
            <input id={'event-name-' + selectedObj.id} name="activityName" value={selectedObj.name} onChange={(evt) => setSelectedEventName(evt.target.value)}></input>
          </div>
          <fieldset className={styles['participants-field']}>
            <legend>Participants:</legend>
            {app_model.entities.map((ent) => {
              if (ent.id === selectedEnt.id) {
                return (
                  <div className={styles['participant-container']} key={ent.id}>
                    <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                    <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(selectedEnt.id)} disabled></input>
                  </div>
                )
              } else return (
                <div className={styles['participant-container']} key={ent.id}>
                  <label htmlFor={'ent-selection-' + ent.id}>{ent.name}: </label>
                  <input id={'ent-selection-' + ent.id} name={'ent-selection-name-' + ent.name} type="checkbox" checked={selectedObj.participants.includes(ent.id)} onChange={(evt) => setSelectedEventParticipants(evt)}></input>
                </div>
                )
            })}
          </fieldset>
          <div className={styles['type-container']}>
              <label className={styles['type-label']}>Type: </label>
              <input className={styles['type-button']} id={'event-type-scheduled'} name={'event-type'} type="radio" checked={selectedObj.scheduled} onChange={(evt) => setSelectedEventType(evt)}></input>
              <label className={styles['type-button-label']} htmlFor={'event-type-scheduled'}>Scheduled</label>
              <input className={styles['type-button']} id={'event-type-controlled'} name={'event-type'} type="radio" checked={!selectedObj.scheduled} onChange={(evt) => setSelectedEventType(evt)}></input>
              <label className={styles['type-button-label']} htmlFor={'event-type-controlled'}>Controlled</label>
            </div>
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
