/* Constructor and methods for the base event object
 */

import regexes from './regexes.js';
import resourceObj from './resourceobj.js';
import { isString } from '../utilities.js';

const eventObjVersion = '0.1.001';

export default function eventObj() {
    this.metadata = {};
    this.metadata.version = eventObjVersion;
}


eventObj.prototype.setExported = function (exported) {
    if (Date.parse(exported)) {
        this.metadata = this.metadata || {};
        this.metadata.exported = new Date(exported);
    } else {
        throw Error('Can not validate exported date');
    }
};

eventObj.prototype.setVersion = function (version) {
    if (regexes.version.test(version)) {
        this.metadata = this.metadata || {};
        this.metadata.version = version;
    } else {
        throw Error('Can not validate version number');
    }
};

eventObj.prototype.setTimeStart = function(time) {
    if (Date.parse(time)) {
        this.timeStart = new Date(time);
    } else {
        throw Error('Cannot validate start time');
    }
};

eventObj.prototype.setTimeEnd = function(time) {
    if (Date.parse(time)) {
        this.timeEnd = new Date(time);
    } else {
        throw Error('Cannot validate end time');
    }
};

eventObj.prototype.setEventName = function (eventName) {
    if (isString(eventName) && eventName.length < 255) {
        this.eventName = eventName;
    } else {
        throw Error('Cannot validate event name');
    }
};

eventObj.prototype.setEventNumber = function (eventNumber) {
    if (parseInt(eventNumber)) {
        this.eventNumber = parseInt(eventNumber);
    } else {
        throw Error('Cannot validate event number');
    }
};

eventObj.prototype.setBuilding = function (building) {
    if (isString(building) && building.length < 50) {
        this.building = building;
    } else {
        throw Error('Can not validate building name');
    }
};

eventObj.prototype.setSpace = function (space) {
    if (isString(space) && space.length < 50) {
        this.space = space;
    } else {
        throw Error('Can not validate space name');
    }
};

eventObj.prototype.setType = function (type) {
    if (isString(type) && type.length < 100) {
        this.type = type;
    } else {
        throw Error('Can not validate event type');
    }
};

eventObj.prototype.setAttend = function (attend) {
    if (parseInt(attend)) {
        this.attend = parseInt(attend);
    } else {
        throw Error('Can not validate attendance');
    }
};

eventObj.prototype.setDetails = function (details) {
    // Expects a three element array from the TTX file
    //
    if (details instanceof Array && details.length == 3) {
        if (details[0]) {
            this.onsite = details[0].match(/^[\s]*Onsite: (.+)/)[1];
        }
        let eventDet = details[1].match(/^#([0-9]{5,})[\s]*(.+)/);
        this.eventNumber = eventDet[1];
        this.eventName = eventDet[2];
        if(details[2]) {
            this.contact = details[2];
        }
    } else {
        throw Error('Can not validate details (expected array of length 3)');
    }
};

eventObj.prototype.addResource = function (resource) {
    this.resources = this.resources || [];
    if (resource instanceof resourceObj) {
        this.resources.push(resource);
    } else {
        throw Error ('Can not validate resource');
    }
};

eventObj.prototype.addResourceNote = function (note) {
    if(this.resources) {
        let last = this.resources.length - 1;
        this.resources[last].appendNote(note);
    }
};
