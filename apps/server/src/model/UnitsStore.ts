import Unit from './Unit';

export default class UnitsStore {
  public units: { [key: string]: Unit } = {};
  
  addUnits(units: Array<Unit>) : void {
    units.forEach(unit => {
      this.units[unit.id] = unit;
    });
  }
}
