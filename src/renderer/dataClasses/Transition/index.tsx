export default class Transition {
  id: number;
  name: string;
  from_event: number;
  to_event: number;
  participant: number;
  constructor(id=0, name='New Transition', from_event=0,
    to_event=0, participant=0){
    this.id = id;
    this.name = name;
    this.from_event = from_event;
    this.to_event = to_event;
    this.participant = participant;
  }
};