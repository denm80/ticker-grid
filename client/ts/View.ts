import {DataModel} from "./DataModel";
import {Row} from "./Row";
export class View {
    private tbody:any;

    constructor(private model:DataModel, private container:Element) {
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');

        let tr = document.createElement('tr');
        this.model.headers.forEach(function (item:string) {
            let th = document.createElement('th');
            th.innerText = item;
            tr.appendChild(th);
        });
        thead.appendChild(tr);

        this.model.rows.forEach(function (row:Row) {
            let tr = document.createElement('tr');
            row.data.forEach(function (data:string) {
                let td = document.createElement('td');
                td.innerText = data;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(thead);

        // tbody.addEventListener('animationend', this.clearAnimation);

        table.appendChild(tbody);
        this.container.appendChild(table);
        this.tbody = tbody;

        this.model.addListener('updated', this.onUpdated.bind(this));
    }

    // private clearAnimation(evt) {
    //     evt.target.className = '';
    // }

    private onUpdated(evt:any) {
        for (let i = 0; i < this.model.rows.length; i++) {
            let row = this.model.rows[i];
            let tr = this.tbody.children[i];
            for (let j = 0; j < row.changes.length; j++) {
                let index = row.changes[j];
                tr.children[index].innerText = row.data[index];
            }
            if (row.changes.length > 0) {
                tr.className = 'clear';
                setTimeout(() => tr.className = 'changed', 0);
            }
        }
    }

}