import './jquery.csv.js';
import eventObj from '../objects/eventobj.js';
import resourceObj from '../objects/resourceobj.js';
import spaceObj from '../objects/spaceobj.js';

export default function parseCSV(contents) {
    var source = 'csv';
    var exported;
    var buildings = new Set();
    var spacesStr = new Set();
    var dateFirst, dateLast, building, date;
    var index = {
        building: 1,
        date: 16,
        space: 17,
        time: 18,
        eventNumber: 19,
        eventName: 20
    };
    var lines = $.csv.toArrays(contents);
    var events = lines.map(function(line) {
        let thisDate = new Date(line[index.date]);
        dateFirst = new Date(dateFirst ? Math.min(dateFirst, Date.parse(thisDate)) : thisDate);
        dateLast = new Date(dateLast ? Math.max(dateLast, Date.parse(thisDate)) : thisDate);
        let timeStart = new Date(thisDate);
        let timeEnd = new Date(thisDate);
        let [start, end] = line[index.time].split(' - ');
        timeStart.setHours(...start.split(':'));
        timeEnd.setHours(...end.split(':'));
        thisEvent = new eventObj();
        thisEvent.setSource(source);
        thisEvent.setBuilding(line[index.building]);
        buildings.add(line[index.building]);
        thisEvent.setSpace(line[index.space]);
        spacesStr.add(building + '|' + line[index.space]);
        thisEvent.setTimeStart(timeStart);
        thisEvent.setTimeEnd(timeEnd);
        thisEvent.setEventName(line[index.eventName]);
        thisEvent.setEventNumber(line[index.eventNumber].slice(1,6));
        thisEvent.setExported(exported);
        /*
        let thisEvent = {
            building: line[index.building],
            space: line[index.space],
            timeStart: timeStart,
            timeEnd: timeEnd,
            eventNumber: line[index.eventNumber].substr(1,5),
            eventName: line[index.eventName]
        };
        */
        return thisEvent;
    });
    return {
        events: events,
        buildings: buildings,
        spaces: [...spacesStr].map(str => new spaceObj(...str.split('|'))),
        dateFirst: dateFirst,
        dateLast: dateLast,
        exported: exported
    };
}
