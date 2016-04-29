import {Row} from "./Row";
import {Observable} from "./Observable";

export class DataModel extends Observable{
    private _headers: string[] = [];
    private _rows: Row[] = [];

    constructor(data: String) {
        super();
        let lines  = data.toString().split('\n');
        lines.pop();

        this._headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            let row = new Row(lines[i]);
            this._rows.push(row);
        }
    }

    public update(data: String) {
        let lines  = data.toString().split('\n');
        lines.pop();
        for (let i = 0; i < lines.length; i++) {
            this._rows[i].update(lines[i]);
        }
        this.fireEvent('updated', this);
    }

    get rows(): Row[] {
        return this._rows;
    }

    get headers(): string[] {
        return this._headers;
    }

}