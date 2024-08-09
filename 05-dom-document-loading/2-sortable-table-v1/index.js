export default class SortableTable {
  #data;
  #element;
  #headerConfig;
  #subElements;



  get element() {
    return this.#element;
  }

  get subElements() {
    return this.#subElements;
  }



  constructor(headerConfig = [], data = []) {
    this.#headerConfig = !Array.isArray(headerConfig) ? [] : [...headerConfig];
    this.#data = !Array.isArray(data) ? [] : [...data];
    this.#element = this.#createElement();
    this.#subElements = this.#createSubElements();
  }



  #createBodyHtml() {
    return `<div data-element="body" class="sortable-table__body">${this.#createBodyRowsHtml()}</div>`;
  }

  #createBodyRowHtml(row) {
    const images = !Array.isArray(row.images) ? [] : row.images;
    const innerHtml = this.#headerConfig.map(c => !c.template ? `<div class="sortable-table__cell">${row[c.id]}</div>` : c.template(images)).join(``);

    return `<a class="sortable-table__row" href="">${innerHtml}</a>`;
  }

  #createBodyRowsHtml() {
    return this.#data.map(r => this.#createBodyRowHtml(r)).join(``);
  }

  #createElement() {
    const element = document.createElement(`div`);
    element.innerHTML = this.#createElementHtml();

    return element.firstElementChild;
  }

  #createElementHtml() {
    return `<div data-element="productsContainer" class="products-list__container">${this.#createTableHtml()}</div>`;
  }

  #createHeaderCellHtml({ id, sortable, title }) {
    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"><span>${title}</span></div>`;
  }

  #createHeaderCellsHtml() {
    return this.#headerConfig.map(c => this.#createHeaderCellHtml(c)).join(``);
  }

  #createHeaderHtml() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">${this.#createHeaderCellsHtml()}</div>`;
  }

  #createSubElements() {
    const subElements = {};
    this.#element?.querySelectorAll(`[data-element]`).forEach(e => {
      subElements[e.dataset.element] = e;
    });

    return subElements;
  }

  #createTableHtml() {
    return `<div class="sortable-table">${this.#createHeaderHtml()}${this.#createBodyHtml()}</div>`;
  }

  #getSortType(columnId) {
    const column = this.#headerConfig.find(c => c.id === columnId);

    return !column?.sortable ? undefined : column.sortType;
  }

  #sortData(sortingId, sortOrder) {
    const sortType = this.#getSortType(sortingId);

    this.#data.sort((dataItem1, dataItem2) => {
      switch (sortType) {
        case `number`:
          return this.#sortNumbers(dataItem1[sortingId], dataItem2[sortingId], sortOrder);
        case `string`:
          return this.#sortStrings(dataItem1[sortingId], dataItem2[sortingId], sortOrder);
      }
    });
  }

  #sortNumbers(number1, number2, sortOrder) {
    return (sortOrder === `desc` ? -1 : 1) * (number1 - number2);
  }

  #sortStrings(string1, string2, sortOrder) {
    return (sortOrder === `desc` ? -1 : 1) * string1.localeCompare(string2, `ru`, {
      //caseFirst: `upper`,
      sensitivity: `variant`
    });
  }



  destroy() {
    this.remove();
  }

  remove() {
    this.#element.remove();
  }

  sort(sortingId, sortOrder = 'asc') {
    this.#sortData(sortingId, sortOrder);

    const bodyElement = this.subElements.body;
    bodyElement.innerHTML = this.#createBodyRowsHtml();
  }
}
