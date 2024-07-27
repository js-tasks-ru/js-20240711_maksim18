export default class ColumnChart {
    #chartHeight;
    #data;
    #element;
    #formatHeading;
    #label;
    #link;
    #value;



    get chartHeight() {
        return this.#chartHeight;
    }

    get element() {
        return this.#element;
    }



    constructor({ data, formatHeading, label, link, value } = {}) {
        this.#chartHeight = 50;

        this.#data = data ?? [];
        this.#formatHeading = formatHeading;
        this.#label = label ?? ``;
        this.#link = link;
        this.#value = value ?? 0;

        this.#element = this._createElement();
    }



    _createChartColumnsHtml(data){
        let html = ``;
        this._getColumnData(data).forEach(i => html += `<div style="--value:${i.value}" data-tooltip="${i.percent}" class=""></div>`);

        return html;
    }

    _createChartHtml() {
        return `<div class="column-chart__chart">${this._createChartColumnsHtml(this.#data)}</div>`;
    }

    _createContainerHtml() {
        return `<div class="column-chart__container">${this._createHeaderHtml()}${this._createChartHtml()}</div>`;
    }

    _createElement() {
        const element = document.createElement(`div`);
        element.innerHTML = this._createElementHtml();

        return element.firstElementChild;
    }

    _createElementHtml() {
        const additionalCssClass = !Array.isArray(this.#data) || this.#data.length === 0 ? `column-chart_loading` : ``;

        return `<div class="column-chart ${additionalCssClass}" style="--chart-height: 50">${this._createTitleHtml()}${this._createContainerHtml()}</div>`;
    }

    _createHeaderHtml() {
        return `<div class="column-chart__header">${!this.#formatHeading ? this.#value : this.#formatHeading(this.#value)}</div>`;
    }

    _createLinkHtml() {
        return !this.#link ? `` : `<a class="column-chart__link" href="${this.#link}">View All</a>`;
    }

    _createTitleHtml() {
        return `<div class="column-chart__title">${this.#label}${this._createLinkHtml()}</div>`;
    }

    _getColumnData(data) {
        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;

        return data.map(i => ({
            percent: `${(i / maxValue * 100).toFixed(0)}%`,
            value: `${Math.floor(i * scale)}`,
        }));
    }



    destroy() {
        this.remove();
    }

    remove() {
        this.#element.remove();
    }

    update(data) {
        const chartElement = this.#element.querySelector(`.column-chart__chart`);
        chartElement.innerHTML = this._createChartColumnsHtml(data);
    }
}
