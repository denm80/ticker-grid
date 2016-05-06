import {Row} from "./Row";
import {Observable} from "./Observable";

/**
 * Class represents data model and contains rows and headers and fires event after update.
 */
export class DataModel extends Observable {
    private _headers:string[] = [];
    private _rows:Row[] = [];


    /**
     * Initialization of rows and headers.
     * @constructor
     * @param {String} data - raw data in csv format.
     */
    constructor(data:String) {
        super();
        let lines = data.toString().split('\n');
        lines.pop();

        this._headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            let row = new Row(lines[i]);
            this._rows.push(row);
        }
    }


    /**
     * Updating rows and firing event.
     * @param {String} data - raw data in csv format.
     */
    public update(data:String) {
        let lines = data.toString().split('\n');
        lines.pop();
        for (let i = 0; i < lines.length; i++) {
            this._rows[i].update(lines[i]);
        }
        this.fireEvent('updated', this);
    }


    /**
     * Returns a data for rows.
     * @returns {Row[]}
     */
    get rows():Row[] {
        return this._rows;
    }



    /**
     * Returns a data for headers.
     * @returns {string[]}
     */
    get headers():string[] {
        return this._headers;
    }

}