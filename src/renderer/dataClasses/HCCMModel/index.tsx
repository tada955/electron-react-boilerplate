import Entity from '../Entity';
import EntityAttribute from '../EntityAttribute';
import Event from '../Event';
import Activity from '../Activity';

export default class HCCM_Model {
  id: number;
  name: string;
  entities: Entity[];
  entity_attributes: EntityAttribute[];
  activities: Activity[];
  events: Event[];
  transitions: number[];
  logic: number[];
  constructor(id=0, name='New HCCM Model', entities=[], entity_attributes=[],
  activities=[], events=[], transitions=[], logic=[]){
    this.id = id;
    this.name = name;
    this.entities = entities;
    this.entity_attributes = entity_attributes;
    this.activities = activities;
    this.events = events;
    this.transitions = transitions;
    this.logic = logic;
  }
}

export function addEntity(mod: HCCM_Model, ent: Entity){
  mod.entities.push(ent);
  return mod;
}

export function getEntity(mod: HCCM_Model, id: number){
  return mod.entities.find((a) => a.id === id);
}

export function removeEntity(mod: HCCM_Model, ent_id: number){
  mod.entities = mod.entities.filter((e) => e.id !== ent_id)
  mod.entity_attributes = mod.entity_attributes.filter((e) => e.entity_id !== ent_id)
  return mod;
}

export function addEntityAttribute(mod: HCCM_Model, entAttr: EntityAttribute){
  const ent = mod.entities.find((e) => e.id === entAttr.entity_id);
  if (ent) {
    ent.entity_attributes.push(entAttr.id);
    mod.entity_attributes.push(entAttr);
  }
  return mod;
}

export function removeEntityAttribute(mod: HCCM_Model, entAttr: EntityAttribute){
  const ent = mod.entities.find((e) => e.id === entAttr.entity_id);
  ent.entity_attributes = ent.entity_attributes.filter((i) => i !== entAttr.id)
  mod.entity_attributes = mod.entity_attributes.filter((e) => e.id !== entAttr.id)
  return mod;
}

export function addActivity(mod: HCCM_Model, act: Activity){
  mod.activities.push(act);
  for (var e of act.participants) {
    const ent = mod.entities.find((e1) => e1.id === e);
    if (ent) {
      ent.entity_activities.push(act.id);
    }
  }
  return mod;
}

export function getActivity(mod: HCCM_Model, id: number){
  return mod.activities.find((a) => a.id === id);
}

export function addActivityParticipant(mod: HCCM_Model, act: Activity, ent: Entity) {

  mod.activities.find((a) => a.id === act.id)?.participants.push(ent.id);
  mod.entities.find((a) => a.id === ent.id)?.entity_activities.push(act.id);

  return mod;
}

export function removeActivityParticipant(mod: HCCM_Model, act: Activity, ent: Entity) {

  const mod_act = mod.activities.find((a) => a.id === act.id)
  mod_act.participants = mod_act.participants.filter((p) => p != ent.id);

  const mod_ent = mod.entities.find((a) => a.id === ent.id)
  mod_ent.entity_activities = mod_ent.entity_activities.filter((p) => p != act.id);

  return mod;
}

// export function updateActivity(mod: HCCM_Model, act: Activity){
//     mod.activities = mod.activites.map((a) => {
//       if (a.id === newAct.id) {
//         return newAct;
//       } else {
//         return a;
//       }
//     });
//     setAppModel(mod);
// }

export function removeActivity(mod: HCCM_Model, act: Activity){
  for (var e of act.participants) {
    const ent = mod.entities.find((e1) => e1.id === e);
    if (ent) {
      ent.entity_activities = ent.entity_activities.filter((i) => i != act.id)
    }
  }
  mod.activities = mod.activities.filter((a) => a.id != act.id)
  return mod;
}

export function addEvent(mod: HCCM_Model, evt: Event){
  mod.events.push(evt);
  for (var e of evt.participants) {
    const ent = mod.entities.find((e1) => e1.id === e);
    if (ent) {
      ent.entity_events.push(evt.id);
    }
  }
  return mod;
}

export function getEvent(mod: HCCM_Model, id: number){
  return mod.events.find((a) => a.id === id);
}

export function addEventParticipant(mod: HCCM_Model, evt: Event, ent: Entity) {

  mod.events.find((a) => a.id === evt.id)?.participants.push(ent.id);
  mod.entities.find((a) => a.id === ent.id)?.entity_events.push(evt.id);

  return mod;
}

export function removeEventParticipant(mod: HCCM_Model, evt: Event, ent: Entity) {

  const mod_evt = mod.events.find((a) => a.id === evt.id)
  mod_evt.participants = mod_evt.participants.filter((p) => p != ent.id);

  const mod_ent = mod.entities.find((a) => a.id === ent.id)
  mod_ent.entity_events = mod_ent.entity_events.filter((p) => p != evt.id);

  return mod;
}

export function removeEvent(mod: HCCM_Model, evt: Event){
  for (var e of evt.participants) {
    const ent = mod.entities.find((e1) => e1.id === e);
    if (ent) {
      ent.entity_events = ent.entity_events.filter((i) => i != evt.id)
    }
  }
  mod.events = mod.events.filter((a) => a.id != evt.id)
  return mod;
}
