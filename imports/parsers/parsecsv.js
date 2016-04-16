import './jquery.csv.js';
import eventObj from '../objects/eventobj.js';
import resourceObj from '../objects/resourceobj.js';

export default function parseCSV(contents) {
    var source = 'csv';
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
        let timeStart = new Date(thisDate);
        let timeEnd = new Date(thisDate);
        let [start, end] = line[index.time].split(' - ');
        timeStart.setHours(...start.split(':'));
        timeEnd.setHours(...end.split(':'));
        thisEvent = new eventObj();
        thisEvent.setSource(source);
        thisEvent.setBuilding(line[index.building]);
        thisEvent.setSpace(line[index.space]);
        thisEvent.setTimeStart(timeStart);
        thisEvent.setTimeEnd(timeEnd);
        thisEvent.setEventName(line[index.eventName]);
        console.log(line[index.eventNumber]);
        thisEvent.setEventNumber(line[index.eventNumber].slice(1,5));
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
    return events;
}
