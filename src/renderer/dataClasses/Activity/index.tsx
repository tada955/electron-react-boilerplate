export default class Activity {
  id: number;
  name: string;
  start_event: number;
  end_event: number;
  participants: number[];
  // start_logic: number;
  // end_logic: number;
  constructor(id=0, name='New Activity', start_event=0,
    end_event=0, participants=new Array<number>()){
    // , start_logic=0, end_logic=0){
    this.id = id;
    this.name = name;
    this.start_event = start_event;
    this.end_event = end_event;
    this.participants = participants;
    // this.start_logic = start_logic;
    // this.end_logic = end_logic;
  }
};