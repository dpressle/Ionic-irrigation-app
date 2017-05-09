export class State {
    constructor(
        public version: string,
        public run: string,
        public zones: number,
        public schedules: number,
        public timenow: number,
        public events: number,
        public onzone: string,
        public offtime: number
    ){}
}