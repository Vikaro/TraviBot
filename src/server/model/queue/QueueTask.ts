export default class QueueTask {
    private task :() => Promise<any>;
    public id: any;
    constructor(id:any, task : (() => Promise<any>)){
       this.task = task; 
    }
    public Run = async () : Promise<any> => {
        return this.task();
    }
}
