import {IEventHandler} from "./IEventHandler";

/**
 * Сlass allows to add, remove event listeners and to fire custom event.
 */
export class Observable {
    private listeners:Map<string, IEventHandler[]> = new Map();

    /**
     * Adds passed listener for passed event
     * @param {string} eventName - name of event.
     * @param {IEventHandler} listener - handler of event.
     */
    public addListener(eventName:string, listener:IEventHandler) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
        }
        this.listeners.get(eventName).push(listener);
    }

    /**
     * Removes passed listener for passed event
     * @param {string} eventName - name of event.
     * @param {IEventHandler} listener - handler of event.
     */
    public removeListener(eventName:string, listener:IEventHandler) {
        if (this.listeners.has(eventName)) {
            let listeners = this.listeners.get(eventName);
            this.listeners.set(eventName, listeners.filter(item => item !== listener));
        }
    }

    /**
     * Fires event and notifies all listeners
     * @param {string} eventName - name of event.
     */
    public fireEvent(eventName:string, evt:any) {
        if (this.listeners.has(eventName)) {
            this.listeners.get(eventName).forEach(item => item(evt));
        }
    }
}