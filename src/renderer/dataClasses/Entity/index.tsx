export default class Entity {
  id: number;
  name: string;
  active_type: boolean;
  entity_attributes: number[];
  entity_activities: number[];
  entity_events: number[];
  entity_transitions: number[];
  constructor(id=0, name='New Entity', active_type=true, entity_attributes=[],
    entity_activities=[], entity_events=[], entity_transitions=[]){
    this.id = id;
    this.name = name;
    this.active_type = active_type;
    this.entity_attributes = entity_attributes;
    this.entity_activities = entity_activities;
    this.entity_events = entity_events;
    this.entity_transitions = entity_transitions;
  }
};