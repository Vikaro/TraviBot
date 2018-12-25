import { describe, it } from 'mocha'
import { expect, assert } from 'chai';
import TravianAPI from '../../server/TravianAPI';
import { parseVillageBuildings, parseAdventuresPage, parseResourceBuildings } from '../../server/parser/TravianParser';
import { Response } from 'superagent';
var fs = require('fs');

fs.readFile('DATA', 'utf8', function (err, contents) {
    console.log(contents);
});
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
            console.log(buildings);
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
            console.log(buildings);
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
                console.log(adventures);
            });
        });

    });
})