export default class NotificationMessage {
    static #lastSavedInstance;



    #duration;
    #element;
    #message;
    #timerId;
    #type;



    get duration() {
        return this.#duration;
    }

    get element() {
        return this.#element;
    }



    constructor(message, { duration, type } = {}) {
        this.#message = message ?? ``;
        this.#duration = duration ?? 0;
        this.#type = type === `sucess` || type === `error` ? type : `success`;

        this.#element = this._createElement();
    }



    _createElement() {
        const element = document.createElement(`div`);
        element.innerHTML = this._createElementHtml();

        return element.firstElementChild;
    }

    _createElementHtml() {
        const value = Math.floor(this.#duration / 1000);

        return `<div class="notification ${this.#type}" style="--value:${value}s">${this._createTimerHtml()}${this._createInnerWrapperHtml()}</div>`;
    }

    _createInnerWrapperHtml() {
        return `<div class="inner-wrapper">${this._createNotificationHeaderHtml()}${this._createNotificationBodyHtml()}</div>`;
    }

    _createNotificationBodyHtml() {
        return `<div class="notification-body">${this.#message}</div>`
    }

    _createNotificationHeaderHtml() {
        return `<div class="notification-header">${this.#type}</div>`
    }

    _createTimerHtml() {
        return `<div class="timer"></div>`;
    }



    destroy() {
        if (this.#timerId) {
            clearTimeout(this.#timerId);
            this.#timerId = null;
        }

        this.remove();

        NotificationMessage.#lastSavedInstance = null;
    }

    hide() {
        this.destroy();
    }

    remove() {
        this.#element.remove();
    }

    show(container = document.body) {
        NotificationMessage.#lastSavedInstance?.hide();

        NotificationMessage.#lastSavedInstance = this;

        this.#timerId = setTimeout(() => this.hide(), this.#duration);

        container.append(this.#element);
    }
}
