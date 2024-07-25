export default class ColumnChart {
    #chartElement;
    #chartHeight;
    #columnChartElement;
    #data;
    #formatHeading;
    #label;
    #link;
    #value;



    get chartHeight() {
        return this.#chartHeight;
    }

    get element() {
        if (!document) {
            return;
        }

        const titleElement = document.createElement(`div`);
        titleElement.classList = `column-chart__title`;

        const linkText = !this.#link ? `` : `<a href="${this.#link}" class="column-chart__link"></a>`;
        titleElement.innerHTML = `${this.#label}${linkText}`;

        const containerElement = document.createElement(`div`);
        containerElement.classList = `column-chart__container`;

        const headerElement = document.createElement(`div`);
        headerElement.classList = `column-chart__header`;

        const value = !this.#formatHeading ? this.#value : this.#formatHeading(this.#value)
        headerElement.append(value);

        const chartElement = document.createElement(`div`);
        chartElement.classList = `column-chart__chart`;

        this.#chartElement = chartElement;
        this.update(this.#data);

        containerElement.append(headerElement, chartElement);

        const columnChartElement = document.createElement(`div`);
        columnChartElement.append(titleElement, containerElement);

        columnChartElement.classList = `column-chart`;
        if (!this.#data) {
            columnChartElement.classList += ` column-chart_loading`;
        }

        this.#columnChartElement = columnChartElement;

        return columnChartElement;
    }



    constructor({ data, formatHeading, label, link, value } = {}) {
        this.#chartHeight = 50;

        this.#data = data;
        this.#formatHeading = formatHeading;
        this.#label = label ?? ``;
        this.#link = link ?? ``;
        this.#value = value ?? 0;
    }



    destroy() {
        this.remove();
    }

    remove() {
        const columnChartElement = this.#columnChartElement;

        if (!columnChartElement) {
            return;
        }

        columnChartElement.remove();
    }

    update(data) {
        const chartElement = this.#chartElement;
        const chartHeight = this.#chartHeight;
        if (!chartElement) {
            return;
        }

        data ??= [];

        if (!Array.isArray(data) || data.length === 0) {
            chartElement.innerHTML = `<img src="charts-skeleton.svg" />`;

            return;
        }

        const maxValue = Math.max(...data);
        const scale = 50 / maxValue;
        const items = data.map(i => ({
            percent: `${(i / maxValue * 100).toFixed(0)}%`,
            value: `${Math.floor(i * scale)}`
        }));

        let html = ``;

        for (const item of items) {
            html += `<div style="--value:${item.value}" data-tooltip="${item.percent}" class=""></div>`;
        }

        chartElement.innerHTML = html;
    }
}
