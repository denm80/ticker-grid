import {IDataModel} from "./IDataModel";

// class provides data for front, can work with many websocket clients
// and requires csv file which has to contain deltas and time intervals for sending data
export class DataProvider {

    // data store
    private store:IDataModel[] = [];
    // websocket clients list
    private clients:any[] = [];
    // current iteration
    private iteration = 0;
    // last timeout ID
    private timeoutId = null;

    // constructor reads csv file and creates internal entities
    constructor(deltas:Buffer) {
        let lines = deltas.toString().split('\n');
        let data = '';
        lines.forEach(function (line:string) {
            if (line.indexOf(',') === -1) {
                let interval = parseInt(line);
                if (isNaN(interval)) {
                    throw new Error('Deltas has incorrect format, line: ' + line);
                }

                this.store.push({
                    interval: interval,
                    data: data
                });
                data = '';
            } else {
                data += line + '\n';
            }
        }.bind(this));
    }

    // registration of new websocket client
    public registerClient(client:any) {
        this.clients.push(client);
        if (this.clients.length === 1) {
            this.timeoutId = setTimeout(this.tick.bind(this), 3000); // first tick
            // this.tick();
        }
    }

    // unregistration of new websocket client
    public unregisterClient(client:any) {
        let index = this.clients.indexOf(client);
        if (index > -1) {
            this.clients.splice(index, 1);
        }
        if (this.clients.length === 0) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            this.iteration = 0;
        }
    }

    // iteration of sending data
    private tick() {
        let obj = this.store[this.iteration];

        let deadClients = [];
        this.clients.forEach(function (client) {
            try {
                client.send(obj.data);
            } catch (exc) {
                deadClients.push(client);
            }
        }.bind(this));

        deadClients.forEach(function (client) {
            this.unregisterClient(client);
        }.bind(this));

        this.timeoutId = setTimeout(this.tick.bind(this), obj.interval);
        if (this.iteration < this.store.length - 1) {
            this.iteration++;
        } else {
            this.iteration = 0;
        }
    }
}