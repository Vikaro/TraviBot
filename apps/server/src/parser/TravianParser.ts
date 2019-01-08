import * as $ from 'cheerio';
import Building, { maxLevel } from '../model/Building';
import { Response } from 'superagent';
import Adventure from '../model/adventure';
import { remove } from '../utility/text';
import Unit from '../model/Unit';

export function parseVillageBuildings(res): { [key: string]: Building } {
  const $res = $(res.text);
  const $areas = $res.find('#village_map area');
  let buldings = {};

  $areas.each((index, el) => {
    let level = maxLevel;
    const $el = $(el);
    const url = $el.attr('href');
    const id = url.replace('build.php?id=', '');
    const title = $el.attr('title');

    const $title = $(title);
    let name;
    if (id === '40') {
      name = $res.find(`.wall`).attr('alt') || 'Empty place';
    } else {
      name =
        $title.first().text() ||
        getBuilding($res.find(`.building, .dx1`), id).attr('alt') ||
        'Empty place';
    }
    if (id === '39' && name === 'Rally Point ') {
      name = 'Empty place';
    }

    const resources = $title
      .children()
      .map(parseResourcesTypes)
      .get();
    const splittedName = name ? name.split('level') : [];

    if (splittedName.length > 1) {
      if (splittedName[1]) level = splittedName[1].trim();
    }

    buldings[id] = new Building({ name, url, resources, level });
  });
  return buldings;
}

export function parseResourceBuildings(res): Array<Building> {
  const $res = $(res.text);
  const $areas = $res.find('#rx area');
  const buildings = $areas.map((index, el) => {
    let level = maxLevel;
    const $el = $(el);
    const url = $el.attr('href');
    const id = url.replace('build.php?id=', '');
    const title = $el.attr('title');

    const $title = $(title);
    var name =
      $title.first().text() || getBuilding($res.find(`.building`), id).attr('alt') || 'Empty place';
    const resources = $title
      .children()
      .map(parseResourcesTypes)
      .get();
    const splittedName = name.split('level');

    if (splittedName.length > 1) {
      if (splittedName[1]) level = splittedName[1].trim();
    }

    return new Building({ name, url, resources, level });
  });
  return buildings.get();
}
function getBuilding(el: Cheerio, id) {
  return el.eq(id - 19);
}
function getBuildingName(id) {
  switch (id) {
    case '19':
      return 'g26';
    case '20':
      return 'g10';
    case '21':
      return 'g11';
    case '22':
      return 'g41';
    case '24':
      return 'g24';
    case '25':
      return 'g14';
    case '27':
      return 'g17';
    case '28':
      return 'g18';
    case '29':
      return 'g21';
    case '30':
      return 'g20';
    case '32':
      return 'g19';
    case '33':
      return 'g12';
    case '34':
      return 'g7';
    case '35':
      return 'g6';
    case '36':
      return 'g22';
    case '38':
      return 'g8';
    case '39':
      return 'g16';
  }
}

export function parseResourcesTypes(index, el) {
  var $el = $(el);
  if ($el.parent().hasClass('resources')) {
    var iconClass = $el.attr('class');
    var type;
    switch (iconClass) {
      case 'r1':
        type = 'Wood';
        break;
      case 'r2':
        type = 'Clay';
        break;
      case 'r3':
        type = 'Iron';
        break;
      case 'r4':
        type = 'Crop';
        break;
      default:
        type = 'undefined';
    }
    var valueText = $el
      .parent()
      .text()
      .trim();
    return { [type]: valueText };
  }
}

export function parseActualQueue(index, el): Building {
  var $el = $(el);
  var name = $el
    .find('.name')
    .text()
    .trim()
    .replace(/\t/g, '');
  var level = $el
    .find('.name lvl')
    .text()
    .trim();
  var buildDuration = $el.find('.buildDuration').text();
  var timeArray = buildDuration.replace('hrs. done at', '').split(' ');
  var duration = timeArray[0].trim();

  const building = new Building({ name, duration, level });

  return building;
}

export function parseBuildingPage(res: Response) {
  const $res = $(res.text);

  const name = $res.find('.build > .titleInHeader').text();
  const level = $res.find('.build > .titleInHeader > .level').text();

  const resources = $res
    .find('.contractCosts .resources')
    .children()
    .map(parseResourcesTypes)
    .get();
  const duration = $res.find('.upgradeButtonsContainer > .section1 > .clocks').text();
  var buildButton = $res.find('.upgradeButtonsContainer > .section1 > .build');

  var building = new Building({ name, resources, duration, level });

  if (buildButton.length > 0) {
    const onClick = buildButton.attr('onclick');
    const upgradeLink = onClick
      .replace("window.location.href = '", '')
      .replace("'; return false;", '')
      .trim();
    building.upgradeUrl = upgradeLink;
  }

  return building;
}

export function parseResourcesPage(
  res: Response
): { actualQueue: Array<Building>; resourceBuildings: Array<Building> } {
  const $res = $(res.text);
  var buildingList = $res.find('.buildingList .boxes-contents ul li');
  const actualQueue = buildingList.map(parseActualQueue).get();

  const resourceBuildings: Array<Building> = parseResourceBuildings(res);
  return {
    actualQueue,
    resourceBuildings
  };
}

/** Parse troops from resourcePage */
export function parseTroops(res: Response) {
  const $res = $(res.text);
  const troopsTable = $res.find('#troops tbody tr');
  const troopsList = troopsTable.map((index, row) => {
    const $el = $(row);
    if ($el.find('td').length > 1) {
      const available = parseInt(
        $el
          .find('.num')
          .text()
          .replace(/\./g, '')
      );
      const name = $el.find('.un').text();
      const unitClass = $el
        .find('.unit')
        .attr('class')
        .replace('unit', '')
        .replace('u', 't')
        .trim();
      let id = 't';
      if (unitClass === 'thero') {
        id += '11';
      } else if (unitClass === 't10') {
        id += '1' + unitClass.substr(unitClass.length - 1);
      } else {
        id += unitClass.substr(unitClass.length - 1);
      }
      return new Unit({ id, name, available });
    }
  });
  return troopsList.get();
}

/** Get village list from resources page */
export function parseVillageList(res: Response): Array<object> {
  const $res = $(res.text);
  const idParam = '?newdid=';
  const villagesArray = $res.find('#sidebarBoxVillagelist li').map((index, el) => {
    const $el = $(el);
    const isActive = $el.hasClass('active');
    const href = $el.find('a').attr('href');
    const id = href.substring(href.lastIndexOf(idParam) + idParam.length).replace('&', '');
    const name = $el.find('.name').text();
    return {
      id,
      isActive,
      name
    };
  });

  return villagesArray.get();
}

export function parseAdventuresPage(res: Response) {
  const $res = $(res.text);
  const heroVillageId = $res
    .find('.heroStatusMessage.header a')
    .attr('onclick')
    .replace("document.location.href='karte.php?z=", '')
    .replace("'", '');
  const adventuresTable = $res.find('table tbody tr');
  const adventures: { [key: string]: Adventure } = {};
  adventuresTable.each((index, el) => {
    const $el = $(el);
    if ($el.text().includes('No adventure found.')) return;
    const location = $el.find('.location').text();
    const moveTime = $el.find('.moveTime').text();
    const difficult = $el.find('.difficulty > img').hasClass('adventureDifficulty0')
      ? 'Hard'
      : 'Normal';
    const id = $el
      .find('.goTo > a')
      .attr('href')
      .replace('a2b.php?id=', '')
      .replace('&h=1', '');
    adventures[id] = new Adventure({
      location,
      moveTime,
      difficult,
      id
    });
  });

  return {
    heroVillageId,
    adventures
  };
}

export function parseAdventurePage(res: Response) {
  const $res = $(res.text);
  const inputs = $res.find('form input');
  const params = inputs
    .map((index, el) => {
      const $el = $(el);
      const name = $el.attr('name');
      const value = $el.attr('value');
      return { [name]: value };
    })
    .get();
  return params;
}
