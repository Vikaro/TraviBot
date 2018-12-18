export default class QueueTask {
    private task :() => Promise<any>;
    constructor(task : (() => Promise<any>)){
       this.task = task; 
    }
    public Run = async () : Promise<any> => {
        return this.task();
    }
}
