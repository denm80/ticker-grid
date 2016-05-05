// class represents row of table
export class Row {
    // data
    private _data: string[] = [];
    // list of indexes which were changed during last update
    private _changes: number[] = [];

    constructor(data: String) {
        this._data  = data.toString().split(',');
    }

    // method updates data
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

    get changes(): number[] {
        return this._changes;
    }

    get data(): string[] {
        return this._data;
    }
}