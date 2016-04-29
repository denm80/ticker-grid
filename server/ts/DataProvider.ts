import {IDataModel} from "./IDataModel";

export class DataProvider {
    private store: IDataModel[] = [];
    private clients: any[] = [];
    private iteration = 0;
    private timeoutId = null;

    constructor(deltas: Buffer) {
        let lines  = deltas.toString().split('\n');
        let data = '';
        lines.forEach(function (line: string) {
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

    public registerClient(client: any) {
        this.clients.push(client);
        if (this.clients.length === 1) {
            this.timeoutId = setTimeout(this.tick.bind(this), 3000); // first tick
            // this.tick();
        }
    }

    public unregisterClient(client: any) {
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