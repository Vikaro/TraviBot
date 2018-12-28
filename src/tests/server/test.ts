import { describe, it } from 'mocha'
import { expect, assert } from 'chai';
import TravianAPI from '../../server/TravianAPI';
import { parseVillageBuildings, parseAdventuresPage, parseResourceBuildings } from '../../server/parser/TravianParser';
import { Response } from 'superagent';
import { parseSmithyPage } from '../../server/parser/smithyParser';
import * as fs from 'fs';
import { townHallParser } from '../../server/parser/townHallParser';
import { parseBarracksPage } from '../../server/parser/barracksParser';
import { parseNewBuildingCaptcha } from '../../server/parser/buildingsParser';
import { AssertionError } from 'assert';

const api = new TravianAPI()
// var assert = require('assert');
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});


describe('Parsing villages buildings', function () {
    describe('village1', function () {
        const file = fs.readFileSync('src/tests/server/responses/villagePage1.html', 'utf8');
        const file2 = fs.readFileSync('src/tests/server/responses/villagePage2.html', 'utf8');

        it('should return atleast one village', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1)
            let res = {};
            res['text'] = file;
            const buildings = parseVillageBuildings(res);
            assert.isNotEmpty(Object.keys(buildings));
        });
        it('should return atleast one village', function () {
            let res = {};
            res['text'] = file2;
            const buildings = parseVillageBuildings(res);
            assert.isNotEmpty(Object.keys(buildings));
        });
        describe("should return valid buildings", () => {
            let res = {};
            res['text'] = file2;
            const buildings = parseVillageBuildings(res);
            it('should return barracks', () => {
                const barracks = buildings[32];
                assert.equal(barracks.name, 'Barracks Level 20');
            })
            it('should return academy', () => {
                const academy = buildings[27];
                assert.equal(academy.name, 'Academy Level 20');
            })
            it('should return smithy', () => {
                const smithy = buildings[28];
                assert.equal(smithy.name, 'Smithy Level 20');
            })
            it('should return rally point', () => {
                const rallyPoint = buildings[39];
                assert.equal(rallyPoint.name, 'Rally Point 20');
            })
            it('should return earth wall', () => {
                const earthWall = buildings[40];
                assert.equal(earthWall.name, 'Earth Wall Level 20 level 20');
            });
        });
    });
    describe('village2', function () {
        const file = fs.readFileSync('src/tests/server/responses/resourcePage1.html', 'utf8');

        it('should return atleast one village', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1)
            let res = {};
            res['text'] = file;
            const buildings = parseResourceBuildings(res);
            assert.isAtLeast(buildings.length, 1);
        });
    });
})

describe('Testing adventures functions', () => {
    describe('parsing adventures', () => {
        const inputFile = fs.readFileSync('src/tests/server/responses/adventuresListPage.html', 'utf8');
        const inputFile2 = fs.readFileSync('src/tests/server/responses/adventuresListPage2.html', 'utf8');
        const fileArray = [inputFile, inputFile2];
        fileArray.forEach(file => {
            it('should return array of adventures', () => {
                // @ts-ignore
                let res: Response = {};
                res['text'] = file;
                const adventures = parseAdventuresPage(res)
                assert.isAtLeast(Object.keys(adventures.adventures).length, 1);
                assert.isNotNull(adventures.heroVillageId)
            });
        });

    });
});

describe('Testing smithy', () => {
    describe('parsing smithy page', () => {
        const inputFile = fs.readFileSync('src/tests/server/responses/smithy1.html', 'utf8');
        const inputFile2 = fs.readFileSync('src/tests/server/responses/smithy2.html', 'utf8');
        // const inputFile3 = fs.readFileSync('src/tests/server/responses/smithy3.html', 'utf8');
        const fileArray = [inputFile, inputFile2];
        fileArray.forEach(file => {
            it('should return dictionary of upgrades', () => {
                // @ts-ignore
                let res: Response = {};
                res['text'] = file;
                const upgrades = parseSmithyPage(res);
                assert.isAtLeast(Object.keys(upgrades).length, 1);
            });
        });

        it('should return valid units', () => {
            // @ts-ignore
            let res: Response = {};
            res['text'] = inputFile;
            const upgrades = parseSmithyPage(res);
            const mercenary = upgrades[1];
            assert.deepEqual(mercenary, {
                id: '1',
                title: 'Mercenary level 4',
                link: 'build.php?id=33&a=1&c=RW76j',
                duration: '00:00:00'
            });
            const bowman = upgrades[2];
            assert.deepEqual(bowman, {
                id: '2',
                title: 'Bowman level 0',
                link: 'build.php?id=33&a=2&c=RW76j',
                duration: '00:00:00'
            });
        });

    });
});



describe('Testing town hall', () => {
    describe('parsing town hall page', () => {
        const inputFile = fs.readFileSync('src/tests/server/responses/townHallPage1.html', 'utf8');
        const fileArray = [inputFile];
        fileArray.forEach(file => {
            it('should return dictionary of celebrations', () => {
                // @ts-ignore
                let res: Response = {};
                res['text'] = file;
                const celebrations = townHallParser(res);
                assert.isAtLeast(Object.keys(celebrations).length, 1);
            });
        });

        it('should return small and big celebration', () => {
            // @ts-ignore
            let res: Response = {};
            res['text'] = inputFile;
            const celebrations = townHallParser(res);
            assert.equal(celebrations[1].title, 'Small Celebration');
            assert.equal(celebrations[1].link, 'build.php?id=19&type=1');

            assert.equal(celebrations[2].title, 'Great celebration (2000 culture points)');
            assert.equal(celebrations[2].link, 'build.php?id=19&type=2');
        })
    });
});


describe('Testing barracks', () => {
    describe('parsing smithy page', () => {
        const inputFile = fs.readFileSync('src/tests/server/responses/barracksPage1.html', 'utf8');
        const fileArray = [inputFile];
        fileArray.forEach(file => {
            it('should return dictionary of units', () => {
                // @ts-ignore
                let res: Response = {};
                res['text'] = file;
                const units = parseBarracksPage(res);
                assert.isAtLeast(Object.keys(units).length, 1);
            });
        });

        it('should return Clubswinger unit', () => {
            // @ts-ignore
            let res: Response = {};
            res['text'] = inputFile;
            const units = parseBarracksPage(res);
            assert.isNotNull(units);
            assert.isNotNull(units['t11']);
            assert.equal(units['t11'].title, 'Clubswinger');
            assert.equal(units['t11'].available, '3704');
        });

    });
});


describe('Testing new buildings', () => {
    describe('parsing page', () => {
        const inputFile = fs.readFileSync('src/tests/server/responses/buildNewBuildingPage1.html', 'utf8');

        it('should return valid captcha', () => {
            // @ts-ignore
            let res: Response = {};
            res['text'] = inputFile;
            const captcha = parseNewBuildingCaptcha(res);
            assert.isNotNull(captcha);
            assert.equal(captcha, 'sNm');

        });
    });
});

