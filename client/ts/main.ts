import {DataModel} from "./DataModel";
import {View} from "./View";

let ws = new WebSocket("ws://localhost:3010/");
let dataModel:DataModel = null;
let view:View = null;

ws.onopen = function () {
    console.log('open');
};

ws.onmessage = function (message) {
    if (!dataModel) {
        dataModel = new DataModel(message.data);
        view = new View(dataModel, document.querySelector('#container'));
    } else {
        dataModel.update(message.data);
    }
};

ws.onclose = function () {
    console.log('close');
};


window.addEventListener('beforeunload', function () {
    ws.close();
});
