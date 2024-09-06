export default class Activity {
  id: number;
  name: string;
  start_event: number;
  end_event: number;
  participants: number[];
  constructor(id=0, name='New Activity', start_event=0,
    end_event=0, participants=new Array<number>()){
    this.id = id;
    this.name = name;
    this.start_event = start_event;
    this.end_event = end_event;
    this.participants = participants;
  }
};