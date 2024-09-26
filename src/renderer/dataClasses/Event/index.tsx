export default class Event {
  id: number;
  name: string;
  scheduled: boolean;
  participants: number[];
  state_changes: number[];
  logic: number;
  constructor(id=0, name='New Event', scheduled=true, participants=new Array<number>(),
    state_changes=new Array<number>(), logic=0){
    this.id = id;
    this.name = name;
    this.scheduled = scheduled;
    this.participants = participants;
    this.state_changes = state_changes;
    this.logic=logic;
  }
};