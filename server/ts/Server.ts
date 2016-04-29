/// <reference path="../../typings/tsd.d.ts"/>
import path = require('path');
import nconf  = require('nconf');
import fs = require('fs');
var ws = require('websocket.io');

import {DataProvider} from './DataProvider';


nconf.file('server', {file: path.join(__dirname, '../..', 'config/server.json')});

// configuring server
var configStores:any = nconf.stores,
    configServer:any = configStores.server.store,
    ws = require('websocket.io'),
    server = ws.listen(configServer.port);

// reading csv
var snapshot:Buffer = fs.readFileSync(path.join(__dirname, '../data', 'snapshot.csv'));
var deltas:Buffer = fs.readFileSync(path.join(__dirname, '../data', 'deltas.csv'));

// creating entities
let dataProvider = new DataProvider(deltas);

// start
server.on('connection', function (client) {
    client.send(snapshot.toString());
    dataProvider.registerClient(client);
    client.on('close', function () {
        dataProvider.unregisterClient(client);
    });
});