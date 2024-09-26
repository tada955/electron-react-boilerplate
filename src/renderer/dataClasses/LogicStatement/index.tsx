export default class LogicStatement {
  id: number;
  value: string;
  logic_id: number;
  constructor(id = 0, value = '', logic_id=0){
    this.id = id;
    this.value = value;
    this.logic_id=logic_id;
  }
};