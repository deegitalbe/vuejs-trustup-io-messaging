export default class KeyPress {
    constructor(el)
    {
        this.callbacks = { keydown: {}, keyup: {} };
        this.el = el;
        this.keyDown = {};
        this.id = Math.random().toString(20).substr(2, 6);
        this.addListeners();
    }

    on(keys, callback) {
        const listener = { name: this.getEventName(keys), callback };
        this.el.addEventListener(listener.name, listener.callback);
        this.listeners.user.push(listener);

        return this;
    }

    off(keys, callback) {
        this.el.removeEventListener(this.getEventName(keys), callback);
    }

    onKeydown(keys, callback)
    {
        this.callbacks.keydown[this.getEventName(keys)] = callback;

        return this
    }

    onKeyup(keys, callback)
    {
        this.callbacks.keyup[this.getEventName(keys)] = callback;

        return this
    }

    addListeners()
    {
        this.listeners = { user: [] };
        return this.addStartListener()
            .addStopListener()
    }

    removeListeners()
    {
        this.el.removeEventListener('keydown', this.listeners.start);
        this.el.removeEventListener('keyup', this.listeners.end);
        this.listeners.user.forEach(({ name, callback }) => this.el.removeEventListener(name, callback))
        this.listeners = {};
    }

    addStartListener()
    {
        this.listeners.start = e => this.addToKeys(e);
        this.el.addEventListener('keydown', this.listeners.start);

        return this;
    }

    addStopListener()
    {
        this.listeners.end = e => this.handleKeyup(e);
        this.el.addEventListener('keyup', this.listeners.end);

        return this;
    }

    normalizeKey(key) {
        return key.toLowerCase()
    }

    addToKeys(e)
    {
        if (! this.keyDown[this.normalizeKey(e.code)]) {
            this.keyDown[this.normalizeKey(e.code)] = true;
        }

        if (this.callbacks.keydown[this.getCurrentEventName()])
            this.callbacks.keydown[this.getCurrentEventName()](e, this);

        return this;
    }

    removeFromKeys(e)
    {
        if (this.keyDown[this.normalizeKey(e.code)]) {
            delete this.keyDown[this.normalizeKey(e.code)];
        }

        return this;
    }

    getKeyPressed()
    {
        return Object.keys(this.keyDown);
    }

    getCurrentEventName()
    {
        return this.getEventName(this.getKeyPressed());
    }

    getEventName(keys)
    {
        return [...keys.map(this.normalizeKey).sort(), this.id].join('-');
    }

    handleKeyup(e)
    {
        if (this.callbacks.keyup[this.getCurrentEventName()])
            this.callbacks.keyup[this.getCurrentEventName()](e, this);

        const event = new CustomEvent(this.getCurrentEventName())
        this.el.dispatchEvent(event);

        this.removeFromKeys(e);
    }
}
