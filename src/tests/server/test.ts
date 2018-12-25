import { describe, it } from 'mocha'
import { expect, assert } from 'chai';
import TravianAPI from '../../server/TravianAPI';
import { parseVillageBuildings, parseAdventuresPage, parseResourceBuildings } from '../../server/parser/TravianParser';
import { Response } from 'superagent';
import { parseSmithyPage } from '../../server/parser/smithyParser';
import * as fs from 'fs';

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

        it('should return atleast one village', function () {
            // assert.equal([1, 2, 3].indexOf(4), -1)
            let res = {};
            res['text'] = file;
            const buildings = parseVillageBuildings(res);
            assert.isAtLeast(buildings.length, 1);
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
        const fileArray = [inputFile,inputFile2];
        fileArray.forEach(file => {
            it('should return dictionary of upgrades', () => {
                // @ts-ignore
                let res: Response = {};
                res['text'] = file;
                const upgrades = parseSmithyPage(res);
                assert.isAtLeast(Object.keys(upgrades).length, 1);
            });
        });

    });
});

