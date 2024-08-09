export default class DoubleSlider {
    #element;
    #formatValue;
    #from;
    #isThumbLeftElementPressed;
    #isThumbRightElementPressed;
    #max;
    #min;
    #to;
    #x;



    get #fromElement() {
        return this.#element.querySelector('span[data-element="from"]');
    }

    get #fromText() {
        const from = Math.floor(this.#from);

        return !this.#formatValue ? from : this.#formatValue(from);
    }

    get #left() {
        return (this.#from - this.#min) / this.#length * 100;
    }

    get #length() {
        return this.#max - this.#min;
    }

    get #progressElement() {
        return this.#element.querySelector(`.range-slider__progress`);
    }

    get #right() {
        return (this.#max - this.#to) / this.#length * 100;
    }

    get #thumbLeftElement() {
        return this.#element.querySelector(`.range-slider__thumb-left`);
    }

    get #thumbRightElement() {
        return this.#element.querySelector(`.range-slider__thumb-right`);
    }

    get #toElement() {
        return this.#element.querySelector('span[data-element="to"]');
    }

    get #toText() {
        const to = Math.floor(this.#to);
        return !this.#formatValue ? to : this.#formatValue(to);
    }



    get element() {
        return this.#element;
    }

    get max() {
        return this.#max;
    }

    get min() {
        return this.#min;
    }



    constructor(config = {}) {
        this.#formatValue = config.formatValue;
        this.#max = config.max ?? 100;
        this.#min = config.min ?? 0;
        const selected = config.selected ?? {};
        this.#from = selected.from ?? this.#min;
        this.#to = selected.to ?? this.#max;

        this.#element = this.#createElement();

        this.#addListeners();
    }



    #addListeners() {
        document.addEventListener(`pointerdown`, this.#onPointerDown);
        document.addEventListener(`pointermove`, this.#onPointerMove);
        document.addEventListener(`pointerup`, this.#onPointerUp);
    }

    #createElement() {
        const element = document.createElement(`div`);
        element.innerHTML = this.#createRangeSliderElementHtml();

        return element.firstElementChild;
    }

    #createRangeSliderElementHtml() {
        const fromElementHtml = `<span data-element="from">${this.#fromText}</span>`;
        const left = this.#left;
        const right = this.#right;
        const progressElementHtml = `<span class="range-slider__progress" style="left: ${left}%; right: ${right}%"></span>`;
        const thumbLeftElementHtml = `<span class="range-slider__thumb-left" style="left: ${left}%"></span>`;
        const thumbRightElementHtml = `<span class="range-slider__thumb-right" style="right: ${right}%"></span>`;
        const innerRangeSliderHtml = `<div class="range-slider__inner">${progressElementHtml}${thumbLeftElementHtml}${thumbRightElementHtml}</div>`;
        const toElementHtml = `<span data-element="to">${this.#toText}</span>`;

        return `<div class="range-slider">${fromElementHtml}${innerRangeSliderHtml}${toElementHtml}</div>`
    }

    #onPointerDown = event => {
        this.#isThumbLeftElementPressed = event.target === this.#thumbLeftElement;
        this.#isThumbRightElementPressed = event.target === this.#thumbRightElement;

        this.#x = event.clientX;
    }

    #onPointerMove = event => {
        if (!this.#isThumbLeftElementPressed && !this.#isThumbRightElementPressed) {
            return;
        }

        const left = this.#element.clientLeft;
        const width = this.#element.clientWidth;
        const ratio = (width - left) / this.#length;
        const offset = event.clientX - this.#x;
        this.#x = event.clientX;

        const relativeOffset = ratio != 0 ? offset / ratio : offset;

        if (this.#isThumbLeftElementPressed) {
            this.#from = this.#toLimit(this.#from + relativeOffset, null, this.#to);
        }

        if (this.#isThumbRightElementPressed) {
            this.#to = this.#toLimit(this.#to + relativeOffset, this.#from);
        }

        this.#updateRangeSliderElement();
        
        this.#element.dispatchEvent(new CustomEvent(`range-select`, { detail: {from: this.#from, to: this.#to}}));
    }

    #onPointerUp = event => {
        this.#isThumbLeftElementPressed = false;
        this.#isThumbRightElementPressed = false;
    }

    #removeListeners() {
        document.removeEventListener(`pointerdown`, this.#onPointerDown);
        document.removeEventListener(`pointermove`, this.#onPointerMove);
        document.removeEventListener(`pointerup`, this.#onPointerUp);
    }

    #toLimit(value, min, max) {
        min ??= this.#min;
        max ??= this.#max;
        return Math.max(min, Math.min(value, max));
    }

    #updateRangeSliderElement() {
        this.#fromElement.textContent = this.#fromText;

        const left = this.#left;
        const right = this.#right;

        this.#progressElement.style.left = `${left}%`;
        this.#progressElement.style.right = `${right}%`;
        this.#thumbLeftElement.style.left = `${left}%`;
        this.#thumbRightElement.style.right = `${right}%`;

        this.#toElement.textContent = this.#toText;
    }



    destroy() {
        this.#removeListeners();

        this.remove();
    }

    remove() {
        this.#element.remove();
    }
}
