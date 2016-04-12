
parseTTX = function(contents) {
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
    for (var i = 0; i < eventBlobs.length; i++) {
        if(eventBlobs[i].length < 3) {
            eventBlobs[i-1].push(...eventBlobs[i]);
            eventBlobs.splice(i,1);
        }
    }

    var events = [];
    var building, date;
    eventBlobs.forEach(function (blob) {
        if (blob[0].charAt(0) == '"') {
            building = s.trim(blob.shift(), '\"');
            console.log('Building:', building);
            blob.shift();
        }
        if (Date.parse(blob[0])) {
            date = new Date(blob.shift());
            console.log('Date:', date);
            blob = blob.slice(2);
        }
        var [start, end] = blob.shift().split('\t').slice(0,2);
        let thisEvent = {
            exported: exported,
            building: building,
            timeStart: new Date(date),
            timeEnd: new Date(date),
            resources: []
        };
        thisEvent.timeStart.setHours(...start.split(':'));
        thisEvent.timeEnd.setHours(...end.split(':'));
        var details = blob.shift().split('\t').map(word => {return s.trim(word, '"');});
        if (details[0]) {
            thisEvent.onsite = details[0].trim().slice(8);
        }
        thisEvent.number = details[1].slice(1,6);
        thisEvent.name = details[1].slice(7);
        if (details[2]) {
            thisEvent.contact = details[2];
        }
        blob.shift();
        blob.forEach(function (line, index) {
            words = line.split('\t').map(word => {return s.trim(word, '"');});
            if (words.length > 1) {
                thisEvent.resources.push({
                    quantity: parseFloat(words[1]),
                    name: words[3]
                });
            } else if (words[0].trim()) {
                thisEvent.resources[thisEvent.resources.length - 1].notes = words[0].replace(/[ ]{2,}/g, '\n');
            }
        });
        events.push(thisEvent);
    });
    return events;
};
