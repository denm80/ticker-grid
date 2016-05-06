/**
 * Class represents row of table.
 */
export class Row {
    private _data: string[] = [];
    private _changes: number[] = [];

    /**
     * Initialization of data.
     * @constructor
     * @param {String} data - line of raw data in csv format.
     */
    constructor(data: String) {
        this._data  = data.toString().split(',');
    }

    /**
     * Updating data.
     * @param {String} data - line of raw data in csv format.
     */
    public update(data: String) {
        let row  = data.toString().split(',');
        this._changes = [];
        for (let i = 0; i < this._data.length; i++) {
            if (!(row[i]==='\r' || row[i]==='') && this._data[i] !== row[i]) {
                this._changes.push(i);
                this._data[i] = row[i];
            }
        }
    }


    /**
     * Returns indexes of changed elements.
     * @returns {number[]}
     */
    get changes(): number[] {
        return this._changes;
    }


    /**
     * Returns data.
     * @returns {string[] }
     */
    get data(): string[] {
        return this._data;
    }
}