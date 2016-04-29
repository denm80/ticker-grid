import {IEventHandler} from "./IEventHandler";
export class Observable {
    private listeners:Map<string, IEventHandler[]> = new Map();

    public addListener(eventName:string, listener:IEventHandler) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(listener);
    }

    public removeListener(eventName:string, listener:IEventHandler) {
        if (this.listeners.has(eventName)) {
            let listeners = this.listeners.get(eventName);
            this.listeners.set(eventName, listeners.filter(item => item !== listener));
        }
    }

    public fireEvent(eventName:string, evt:any) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).forEach(item => item(evt));
        }
    }
}