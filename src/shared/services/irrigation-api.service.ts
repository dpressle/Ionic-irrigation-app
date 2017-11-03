import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { LoadingController,
         Events } from 'ionic-angular';

// import { Storage } from '@ionic/storage';
import { State, Logs, Settings, Wcheck } from '../../shared/models';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/throw';
import '../rxjs-extensions';

@Injectable()
export class SprinklersApiService {
    private baseUrl: string;
    // private configService: ConfigService;

    constructor(
        private http: Http,
        private loaderCtrl: LoadingController,
        private events: Events,
        private config: ConfigService) {
            // this.configService = new ConfigService();
            this.setUrl();
           // console.log('base url in api', this.baseUrl);
            events.subscribe('config:save', () => {
                this.setUrl();
            });
    }

    setUrl(){
        console.log('baseUrl set in api');
        this.baseUrl = this.config.url;
    }

    /**
     * Handle any errors from api
     * @param error - the error object 
     */
    handleError(error: any) {
        let msg: string;

        if (error instanceof Response) {
            let body = error.json() || '';
            let err = body.error || JSON.stringify(body);
            msg = `Error status code ${err.status} - ${err.statusText || '' } ${err}`;
        } else {
            msg = error.message ? error.message : error.toString();
        }

        console.error(msg);
        return Observable.throw(msg);
    }
    /**
     * 
     * @param baseUrl set the scheduling state does not return anything
     * @param schedState 
     */
    setState(schedState: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/bin/run?system=${schedState}`)
            //.map((res: Response) => <number>res.status)
            //.do(data => console.log(data))
            .catch(this.handleError);
    }

    getState() : Observable<State> {
        return this.http.get(`${this.baseUrl}/json/state`)
            .timeout(10000)
            .map((res: Response) => res.json())
            //.do(data => console.log(data))
            .catch(this.handleError);
    }
    /**
     * 
     * @param baseUrl get all zones
     */
    getZones() : Observable<any[]> {
        // console.log('getZone Url', this.baseUrl)
        let loader = this.loaderCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        return this.http.get(`${this.baseUrl}/json/zones`)
            .timeout(10000)
            .map((res: Response) => res.json().zones)
            //.do(data => console.log(data))
            .catch(this.handleError)
            .finally(() => loader.dismiss());
    }
    /**
     * Save zones details
     * @param baseUrl the url to make the api call 
     * @param zonesDetails zone details to save
     */
    setZones(zonesDetails: string): Observable<any> {
        //this.loader.present();
        return this.http.get(`${this.baseUrl}/bin/setZones?${zonesDetails}`)
            // .map((res: Response) => res.status)
            .do(() => this.events.publish('zones:save'))
            .catch(this.handleError);
        //.finally(() => this.loader.dismiss());
    }

    runZone(zone: string, state: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/bin/manual?zone=z${zone}&state=${state}`)
            // .map((res: Response) => res.status)
            //.do(() => this.events.publish('zones:run'))
            .catch(this.handleError);
    }

    getSchedules(): Observable<any[]> {
        let loader = this.loaderCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        return this.http.get(`${this.baseUrl}/json/schedules`)
            .map((res: Response) => res.json().Table)
         //   .do(data => console.log(data))
            .catch(this.handleError)
            .finally(() => loader.dismiss());
    }

    getScheduleDetails(scheduleId: number): Observable<any> {
        let loader = this.loaderCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        return this.http.get(`${this.baseUrl}/json/schedule?id=${scheduleId}`)
            .map((res: Response) => res.json())
           // .do(data => console.log(data))
            .catch(this.handleError)
            .finally(() => loader.dismiss());
    }

    setScheduleDetails(scheduleId: number, schedulingDetails: string): Observable<any> {
        //this.loader.present();
        return this.http.get(`${this.baseUrl}/bin/setSched?id=${scheduleId}&${schedulingDetails}`)
            // .map((res: Response) => res.status)
            .do(() => this.events.publish('schedule:saved', scheduleId))
            .catch(this.handleError);
        //.finally(() => this.loader.dismiss());
    }

    deleteSchedule(scheduleId: number): Observable<any> {
        // this.loader.present();
        return this.http.get(`${this.baseUrl}/bin/delSched?id=${scheduleId}`)
            // .map((res: Response) => res.status)
            .do(() => this.events.publish('schedule:saved', scheduleId))
            .catch(this.handleError);
        //.finally(() => this.loader.dismiss());
    }

    runSchedule(schedulesId: number): Observable<any> {
        //this.loader.present();
        return this.http.get(`${this.baseUrl}/bin/setQSched?sched=${schedulesId}`)
            // .map((res: Response) => res.status)
            // .do(data => console.log(data))
            .catch(this.handleError);
        //.finally(() => this.loader.dismiss());
    }

    runQuickSchedule(zonesDuration: String): Observable<any> {
        return this.http.get(`${this.baseUrl}/bin/setQSched?sched=-1&${zonesDuration}`)
        .catch(this.handleError);
    }

    getLogs(startDate: number, endDate: number): Observable<Logs[]> {
        let loader = this.loaderCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        return this.http.get(`${this.baseUrl}/json/tlogs?sdate=${startDate}&edate=${endDate}`)
            .map((res: Response) => res.json().logs)
            .do(data => console.log(data))
            .catch(this.handleError)
            .finally(() => loader.dismiss());
    }

    getSettings(): Observable<Settings> {
        let loader = this.loaderCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        return this.http.get(`${this.baseUrl}/json/settings`)
            .map((res: Response) => res.json())
            .do(data => console.log(data))
            .catch(this.handleError)
            .finally(() => loader.dismiss());
    }

    setSettings(saveString: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/bin/settings?${saveString}`)
            // .map((res: Response) => res.status)
            // .do(data => console.log(data))
            .catch(this.handleError);
        //.finally(() => loader.dismiss());
    }

    getWether(): Observable<Wcheck> {
        let loader = this.loaderCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        return this.http.get(`${this.baseUrl}/json/wcheck`)
            .map((res: Response) => res.json())
            .do(data => console.log(data))
            .catch(this.handleError)
            .finally(() => loader.dismiss());
    }

    factoryDefaults(): Observable<any> {
        return this.http.get(`${this.baseUrl}/bin/factory`)
            // .map((res: Response) => res.status)
            // .do(data => console.log(data))
            .catch(this.handleError);
    }

    resetSystem(): Observable<any> {
        return this.http.get(`${this.baseUrl}/bin/reset`)
            // .map((res: Response) => res.status)
            // .do(data => console.log(data))
            .catch(this.handleError);
    }
}

