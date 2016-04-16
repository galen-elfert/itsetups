/* Constructor and methods for the base event object
 */

export default function resourceObj() { }
import { isString } from '../utilities.js';

resourceObj.prototype.setName = function (name) {
    // Disabled validation here because for some reason s.trim is not returnig a string?
    if(isString(name)) {
        this.name = name;
    } else {
        throw Error('Can not validate resource name: '+name+', '+typeof(name));
    }
};

resourceObj.prototype.setQuantity = function (quantity) {
    if(parseFloat(quantity)) {
        this.quantity = quantity;
    } else {
        throw Error('Can not validate resource quantity');
    }
};

resourceObj.prototype.setNote = function (note) {
    if(isString(note)) {
        this.note = note;
    } else {
        throw Error('Can not validate resource note');
    }
};

resourceObj.prototype.appendNote = function (note) {
    if(isString(note)) {
        if (this.note) {
            this.note += '\n'+note;
        } else {
            this.note = note;
        }
    } else {
        throw Error('Can not validate resource note');
    }
};

resourceObj.prototype.setTimeStart = function (time) {
    if(time instanceof Date) {
        this.timeStart = time;
    } else {
        throw Error('Can not validate resource start time');
    }
};

resourceObj.prototype.setTimeEnd = function (time) {
    if(time instanceof Date) {
        this.timeEnd = time;
    } else {
        throw Error('Can not validate resource end time');
    }
};
