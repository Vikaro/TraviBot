export default class RepeatableTask {
    private name: string;
    private id: number;
    private intervalId: NodeJS.Timeout;
    private time: number;
    private callback: (...args: any[]) => void;
    constructor(obj: any) {
        Object.assign(this, obj);
    }
    start() {
        this.callback();
        this.intervalId = setInterval(this.callback, this.time);
    }
    stop() {
        clearInterval(this.intervalId);
    }
    getName = () => this.name;
    getId = () => this.id;
}
