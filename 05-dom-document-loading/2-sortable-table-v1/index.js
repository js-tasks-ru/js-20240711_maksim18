export default class SortableTable {
  #data;
  #element;
  #headerConfig;
  #subElements;



  get element() {
    return this.#element;
  }

  get subElements() {
    if (!this.#subElements) {
      this.#subElements = {};
      this._initializeSubElements();
    }

    return this.#subElements;
  }



  constructor(headerConfig = [], data = []) {
    this.#headerConfig = !Array.isArray(headerConfig) ? [] : headerConfig;
    this.#data = !Array.isArray(data) ? [] : data;

    this.#element = this._createElement();
  }



  _createBodyHtml() {
    return `<div data-element="body" class="sortable-table__body">${this._createBodyRowsHtml()}</div>`;
  }

  _createBodyRowHtml(row = {}) {
    const images = !Array.isArray(row.images) ? [] : row.images;
    let innerHtml = ``;
    this.#headerConfig.forEach(c => innerHtml += !c.template ? `<div class="sortable-table__cell">${row[c.id]}</div>` : c.template(images));

    return `<a class="sortable-table__row" href="">${innerHtml}</a>`;
  }

  _createBodyRowsHtml() {
    let innerHtml = ``;
    this.#data.forEach(r => innerHtml += this._createBodyRowHtml(r));

    return innerHtml;
  }

  _createElement() {
    const element = document.createElement(`div`);
    element.innerHTML = this._createElementHtml();

    return element.firstElementChild;
  }

  _createHeaderCellHtml({ id, sortable, title } = {}) {
    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"><span>${title}</span></div>`;
  }

  _createElementHtml() {
    return `<div data-element="productsContainer" class="products-list__container">${this._createTableHtml()}</div>`;
  }

  _createHeaderHtml() {
    let innerHtml = ``;
    this.#headerConfig.forEach(c => innerHtml += this._createHeaderCellHtml(c));

    return `<div data-element="header" class="sortable-table__header sortable-table__row">${innerHtml}</div>`;
  }

  _createTableHtml() {
    return `<div class="sortable-table">${this._createHeaderHtml()}${this._createBodyHtml()}</div>`;
  }

  _initializeSubElements() {
    this.#element.querySelectorAll(`[data-element]`).forEach(e => {
      this.#subElements[e.dataset.element] = e;
    });
  }

  _sortNumbers(number1, number2, sortOrder = `asc`) {
    return (sortOrder === `desc` ? -1 : 1) * (number1 - number2);
  }

  _sortStrings(string1, string2, sortOrder = `asc`) {
    return (sortOrder === `desc` ? -1 : 1) * string1.localeCompare(string2, `ru`, {
      caseFirst: `upper`,
      sensitivity: `variant`
    });
  }



  destroy() {
    this.remove();
  }

  remove() {
    this.#element.remove();
  }

  sort(field, sortOrder = 'asc') {
    const headerCell = this.#headerConfig.find(c => c.id === field);
    if (!headerCell.sortable) {
      return;
    }

    this.#data.sort((dataRow1, dataRow2) => {
      switch (headerCell.sortType) {
        case `number`:
          return this._sortNumbers(dataRow1[field], dataRow2[field], sortOrder);
        case `string`:
          return this._sortStrings(dataRow1[field], dataRow2[field], sortOrder);
        default:
          return;
      }
    });

    const bodyElement = this.subElements.body;
    bodyElement.innerHTML = this._createBodyRowsHtml();
  }
}
