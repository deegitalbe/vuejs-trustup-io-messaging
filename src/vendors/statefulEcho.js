import Echo from 'laravel-echo';
/** Stateful Echo implementation. */
class StatefulEcho
{
    /**
     * Underlying echo instance.
     *
     * @type {Echo}
     */
    echo;

    /**
     * Callbacks to execute
     *
     * @type {((statefulEcho: StatefulEcho) => void)[]}
     */
    callbacks = [];

    /**
     * Initializing echo with given options.
     *
     * Triggering automatically registered callbacks.
     */
    init(options) {
        this.echo = new Echo(options);
        this.callbacks.forEach(callback => callback(this));
        this.callbacks = [];

        return this;
    }

    /** Getting underlying echo instance. */
    getEcho() {
        return this.echo;
    }

    /** Echo current status. */
    isReady() {
        return !!this.echo;
    }

    /**
     * Registering a callback to launch when pusher is ready.
     *
     * @param {(statefulEcho: StatefulEcho) => void} callback
     * @returns
     */
    whenReady(callback) {
        this.isReady() ?
            callback(this)
            : this.callbacks.push(callback);

        return this;
    }
}

const statefulEcho = new StatefulEcho();

export { statefulEcho };
export default StatefulEcho;
