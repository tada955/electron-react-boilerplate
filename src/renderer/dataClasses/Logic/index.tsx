export default class Logic {
  id: number;
  name: string;
  event_id: number;
  logic_statements: number[];
  constructor(id=0, name='New Logic', event_id=0, logic_statements=[]){
    this.id = id;
    this.name = name;
    this.event_id = event_id;
    this.logic_statements = logic_statements;
  }
};