export default class Resources {
  public wood: string;
  public clay: string;
  public iron: string;
  public crop: string;
  constructor(obj){
      Object.assign(this, obj);
  }
}
