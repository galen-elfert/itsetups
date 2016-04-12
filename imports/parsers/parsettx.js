
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
        var [start, end, space, discard, attend] = blob.shift().split('\t').slice(0,5);
        let thisEvent = new eventObj();
        thisEvent.setTimeStart(dateStr+', '+start);
        thisEvent.setTimeEnd(dateStr+', '+end);
        var details = blob.shift().split('\t').map(word => {return s.trim(word, '"');});
        thisEvent.setDetails(details);
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
