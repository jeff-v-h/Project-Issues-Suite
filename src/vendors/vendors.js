import $ from 'jquery';
import { KJUR, b64utoutf8 } from 'jsrsasign';

const vendors = {};
vendors.$ = $;
vendors.KJUR = KJUR;
vendors.b64utoutf8 = b64utoutf8;

export default vendors;
