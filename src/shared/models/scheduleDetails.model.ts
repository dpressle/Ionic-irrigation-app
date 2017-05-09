export class ScheduleDetails {
  id: number;
  name: string;
  enabled: string;
  type: string;
  wadj: string;
  interval: number;
  d1: string;
  d2: string;
  d3: string;
  d4: string;
  d5: string;
  d6: string;
  d7: string;
  //days: Days[];
        // { id: 'd1', name: "Sunday",    selected: false },
        // { id: 'd2', name: "Monday",    selected: false },
        // { id: 'd3', name: "Thursday",  selected: false },
        // { id: 'd4', name: "Wednesday", selected: false },
        // { id: 'd5', name: "Thursday",  selected: false },
        // { id: 'd6', name: "Friday",    selected: false },
        // { id: 'd7', name: "Saturday",  selected: false }];
  times: Times[];
  //       { t: '00:00', e: false },
  //       { t: '00:00', e: false },
  //       { t: '00:00', e: false },
  //       { t: '00:00', e: false }];
  zones: ScheduleZones[];
}

export class Days{
  id: string;
  name: string;
  selected: boolean;
}

export class Times{
  t: string;
  e: boolean;
}

export class ScheduleZones{
  e: string;
  name: string;
  duration: number;
}