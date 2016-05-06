/// <reference path="../../typings/tsd.d.ts"/>
import path = require('path');
import fs = require('fs');
var cong = require('../../config/server');
var ws = require('websocket.io');

import {DataProvider} from './DataProvider';

// configuring server
var server = ws.listen(cong.port);

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