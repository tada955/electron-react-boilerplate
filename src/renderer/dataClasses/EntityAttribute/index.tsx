export default class EntityAttribute {
  id: number;
  name: string;
  value: string;
  entity_id: number;
  constructor(id = 0, name = '', value = '', entity_id=0){
    this.id = id;
    this.name = name;
    this.value = value;
    this.entity_id=entity_id;
  }
};