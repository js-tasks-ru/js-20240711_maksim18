class Tooltip {
  static #instance;



  #element;
  #pointerMoveListener;
  #pointerOutListener;
  #pointerOverListener;



  get element() {
    return this.#element;
  }



  constructor() {
    if (!Tooltip.#instance) {
      Tooltip.#instance = this;
    }

    this.#pointerOverListener = event => this.#onPointerOver(event);
    this.#pointerMoveListener = event => this.#onPointerMove(event);
    this.#pointerOutListener = event => this.#onPointerOut(event);

    return Tooltip.#instance;
  }



  #addListeners() {
    document.body.addEventListener(`pointerover`, this.#pointerOverListener);
    document.body.addEventListener(`pointermove`, this.#pointerMoveListener);
    document.body.addEventListener(`pointerout`, this.#pointerOutListener);
  }

  #changeLocation(x, y) {
    if (!this.#element) {
      return;
    }

    //this.#element.style.position = `ab`;
    this.#element.style.left = `${x + 10}px`;
    this.#element.style.top = `${y + 10}px`;
  }

  #changeText(text) {
    if (!this.#element) {
      return;
    }

    this.#element.innerHTML = text;
  }

  #createElement() {
    const element = document.createElement(`div`);
    element.innerHTML = `<div class="tooltip"></div>`;

    return element.firstElementChild;
  }

  #onPointerMove(event) {
    this.#changeLocation(event.clientX, event.clientY);
  }

  #onPointerOut(event) {
    this.remove();
  }

  #onPointerOver(event) {
    const target = event.target;
    const text = target.dataset?.tooltip;
    if (!text) {
      return;
    }

    this.render(text);

    this.#changeLocation(event.clientX, event.clientY);
  }

  #removeListeners() {
    document.body.removeEventListener(`pointerover`, this.#pointerOverListener);
    document.body.removeEventListener(`pointermove`, this.#pointerMoveListener);
    document.body.removeEventListener(`pointerout`, this.#pointerOutListener);
  }





  destroy() {
    this.#removeListeners();

    this.remove();
  }

  initialize() {
    this.#element = this.#createElement();

    this.#addListeners();
  }

  remove() {
    this.#element?.remove();
  }

  render(text) {
    this.#changeText(text);

    const bodyChildrenElements = Array.from(document.body.children);
    if (!bodyChildrenElements.includes(this.#element)) {
      document.body.append(this.#element);
    }
  }
}

export default Tooltip;
