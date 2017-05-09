export class Logs{
    zone: number;
    entries: LogObject[];
}

export class LogObject{
    date: number;
    duration: number;
    schedule: number;
    seasonal: number;
    wunderground: number;
}