import {DataModel} from "./DataModel";
import {View} from "./View";

// declaration of model and view
let dataModel:DataModel = null;
let view:View = null;

// open websocket connection
let ws = new WebSocket("ws://localhost:3010/");

// registration of websocket handlers
ws.onopen = function () {
    console.log('open');
};

ws.onmessage = function (message) {
    if (!dataModel) {
        // creation of model and view
        dataModel = new DataModel(message.data);
        view = new View(dataModel, document.querySelector('#container'));
    } else {
        // updating data model
        dataModel.update(message.data);
    }
};

ws.onclose = function () {
    console.log('close');
};

// closing websocket connection
window.addEventListener('beforeunload', function () {
    ws.close();
});
