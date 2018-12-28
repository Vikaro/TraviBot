import * as $ from 'cheerio';
import { Response } from 'superagent';
import { remove, removeWhitespaces } from '../utility/text';

export function parseNewBuildingCaptcha(response: Response) {
    const $res = $(response.text);
    const onClickParam = $res.find('.contractLink button').attr('onclick');
    if(!onClickParam) return null
    const splitted = onClickParam.split('c=');
    const captcha = remove(splitted[1], ["'; return false;"]);
    return captcha;
}