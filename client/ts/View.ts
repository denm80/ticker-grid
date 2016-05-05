import {DataModel} from "./DataModel";
import {Row} from "./Row";

// class view receives data model and container (HTML element)
// class subscribes to event of data model and updates DOM when it needs
export class View {
    private tbody:any;

    // generation of html
    constructor(private model:DataModel, private container:Element) {
        let table = document.createElement('table');
        table.className = 'b-layout-table';
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        let tr = document.createElement('tr');
        tr.className = 'b-layout-table__row';
        this.model.headers.forEach(function (item:string) {
            let th = document.createElement('th');
            th.className = 'b-layout-table__header';
            th.innerText = item;
            tr.appendChild(th);
        });
        thead.appendChild(tr);

        this.model.rows.forEach(function (row:Row) {
            let tr = document.createElement('tr');
            tr.className = 'b-layout-table__row';
            row.data.forEach(function (data:string) {
                let td = document.createElement('td');
                td.className = 'b-layout-table__cell';
                td.innerText = data;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        this.container.appendChild(table);
        this.tbody = tbody;

        this.model.addListener('updated', this.onUpdated.bind(this));
    }

    // updating html
    private onUpdated(evt:any) {
        for (let i = 0; i < this.model.rows.length; i++) {
            let row = this.model.rows[i];
            let tr = this.tbody.children[i];
            for (let j = 0; j < row.changes.length; j++) {
                let index = row.changes[j];
                tr.children[index].innerText = row.data[index];
            }
            if (row.changes.length > 0) {
                tr.className = 'b-layout-table__row b-layout-table__inactive';
                setTimeout(() => tr.className = 'b-layout-table__row b-layout-table__active', 0);
            }
        }
    }

}