import './jquery.csv.js';

parseCSV = function (contents) {
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
        let thisEvent = {
            building: line[index.building],
            space: line[index.space],
            timeStart: timeStart,
            timeEnd: timeEnd,
            eventNumber: line[index.eventNumber].substr(1,5),
            eventName: line[index.eventName]
        };
        return thisEvent;
    });
    return events;
};
