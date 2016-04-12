/* Constructor and methods for the base event object
 */

var eventObj = function () { };

eventObj.prototype.setExported = function (exported) {
    if (Date.parse(exported)) {
        this.exported = new Date(exported);
    } else {
        throw Error('Can not validate exported date');
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
    if (eventName instanceof String && eventName.length < 255) {
        this.eventName = evenName;
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
    if (building instanceof String && building.length < 100) {
        this.building = building;
    } else {
        throw Error('Can not validate building name');
    }
};

eventObj.prototype.setSpace = function (space) {
    if (building instanceof String && building.length < 50) {
        this.space = space;
    } else {
        throw Error('Can not validate space name');
    }
};

eventObj.prototype.setDetails = function (details) {
    // Expects a three element array from the TTX file
    //
    if (details instanceof Array && details.length == 3) {
        if (details[0]) {
            this.onsite = details[0].match(/^Onsite: (.+)/);
        }
        let eventDet = details[1].match(/^#([0-9]{5,})[\s]*(.+)/);
        this.eventNumber = eventDet[0];
        this.eventName = eventDet[1];
        if(details[2]) {
            this.contact = details[2];
        }
    } else {
        throw Error('Can not validate details (expected array of length 3)');
    }
};
