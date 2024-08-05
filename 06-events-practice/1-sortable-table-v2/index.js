import { default as SortableTableV1 } from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

// I think the test named "should sort "desc" correctly for "sortType" equal number" is incorrect.
// Initial sorting is made by "title" id but a pointdown event is happend only once.
export default class SortableTable extends SortableTableV1 {
  #header;
  #headerConfig;
  #headerListerner;



  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    super(headersConfig, data);

    this.#header = this.subElements.header;
    this.#headerConfig = headersConfig;
    this.#headerListerner = event => this.#onHeaderClick(event);

    this.#addListeners();
    const { id, order } = sorted;
    this.#updateTable(id, order);
  }



  #addListeners() {
    this.#header.addEventListener(`pointerdown`, this.#headerListerner);
  }

  #createArrowHtml() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>`;
  }

  #createHeaderCellHtml({ id, sortable, title }, sortingId, sortOrder) {
    const incorrectСondition = !sortingId || sortingId !== id;
    const dataOrderAttribute = incorrectСondition ? `` : ` data-order="${sortOrder}"`;
    const arrowHtml = incorrectСondition ? `` : this.#createArrowHtml();

    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"${dataOrderAttribute}><span>${title}</span>${arrowHtml}</div>`;
  }

  #createHeaderCellsHtml(sortingId, sortOrder) {
    return this.#headerConfig.map(c => this.#createHeaderCellHtml(c, sortingId, sortOrder)).join(``);
  }

  #onHeaderClick(event) {
    const headerCellElement = event.target.closest(`div.sortable-table__cell`);
    if (!headerCellElement || headerCellElement.dataset.sortable !== `true`) {
      return;
    }

    const sortingId = headerCellElement.dataset.id;
    let sortOrder = headerCellElement.dataset.order;
    sortOrder = !sortOrder || sortOrder === `desc` ? `asc` : `desc`;
    this.#updateTable(sortingId, sortOrder);
  }

  #removeListeners() {
    this.#header.removeEventListener(`click`, this.#headerListerner);
  }

  #updateHeader(sortingId, sortOrder) {
    this.#header.innerHTML = this.#createHeaderCellsHtml(sortingId, sortOrder);
  }

  #updateTable(sortingId, sortOrder) {
    this.#updateHeader(sortingId, sortOrder);
    this.sort(sortingId, sortOrder);
  }



  destroy() {
    this.#removeListeners();
    super.destroy();
  }
}
