import eventObj from '../objects/eventobj.js';
import resourceObj from '../objects/resourceobj.js';

export default function parseTTX(contents) {
    var count = 0;
    var lines = contents.split('\n').map(line => {return line.trim();});
    var exported = new Date(lines.shift());

    console.log("exported:", exported);
    // Remove the rest of the header, and footer
    lines = lines.slice(3, -3);
    if(Date.parse(lines[0].split('-')[0])) { lines.shift(); }

    // Group lines into events, by on vertical separation
    var eventBlobs = [[]];
    lines.forEach(function (line) {
        if(line !== '') {
            if (count >= 8) {
                eventBlobs.push([]);
            }
            eventBlobs[eventBlobs.length - 1].push(line);
            count = 0;
        } else {
            count++;
        }
    });

    // Gather orphaned lines (certain line types seem to get split accross pages)
    for (var i = 1; i < eventBlobs.length; i++) {
        if(eventBlobs[i].length < 3) {
            eventBlobs[i-1].push(...eventBlobs[i]);
            eventBlobs.splice(i,1);
        }
    }

    var events = [];
    var building, date;
    eventBlobs.forEach(function (blob) {
        // On first event for new building
        if (blob[0].charAt(0) == '"') {
            building = s.trim(blob.shift(), '\"');
            console.log('Building:', building);
            blob.shift();
        }
        // On first event for new date
        if (Date.parse(blob[0])) {
            dateStr = blob.shift();
            blob = blob.slice(2);
        }
        var [start, end, space, type, attend] = blob.shift().split('\t').slice(0,5);
        let thisEvent = new eventObj();
        thisEvent.setExported(exported);
        thisEvent.setTimeStart(dateStr+', '+start);
        thisEvent.setTimeEnd(dateStr+', '+end);
        thisEvent.setSpace(space);
        thisEvent.setType(type);
        if (attend) { thisEvent.setAttend(attend); }
        var details = blob.shift().split('\t').map(word => {return s.trim(word, '"');});
        thisEvent.setDetails(details);
        blob.shift();
        // Read and push resources from remaining lines
        words = blob.map(line => {
            return line.split('\t').map(word => {
                return s.trim(word, '"');
            });
        });
        for (var i = 0; i < words.length; i++) {
            if (words[i].length > 1) {
                let thisResource = new resourceObj();
                thisResource.setName(words[i][3]);
                thisResource.setQuantity(words[i][1]);
                thisEvent.addResource(thisResource);
            } else if (words[i].length == 1) {
                thisEvent.addResourceNote(words[i][0]);
            } else {
                throw Error('Resource validation error');
            }
        }
        events.push(thisEvent);
    });
    return events;
}
