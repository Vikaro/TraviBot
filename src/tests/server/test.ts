import { describe, it } from 'mocha'
import { expect, assert } from 'chai';
import TravianAPI from '../../server/TravianAPI';

const api = new TravianAPI()
// var assert = require('assert');
describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe("API tests", () => {
    it('should return valid API response', async function (done) {
        this.timeout(10000);
        const response = await api.LoginPage();
        expect(response).to.be.not.a(null, "response is not null");
        done();
    })
})