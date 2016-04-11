import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/startup/routes.js';
import '../imports/api/collections.js';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.upload.events({
    'change [name="fileUpload"]' (event, template) {
        let files = event.target.files;
        let file = files[0];
        let fileName = files[0].name;
        let extension = fileName.split('.')[1].toLowerCase();
        if (window.FileReader) {
            console.log('FileReader supported');
            if (extension == 'ttx') {
                let reader = new FileReader();
                reader.onload = function(event) {
                    parseTTXGood(reader.result);
                };
                reader.readAsText(file);
            }
        }
    }
});

/* File parsing functions. One for TTX for events with av, one for CSV with
 * non-av events
 * Args:    contents (String)
 * Returns: Array of event objects.
 */

// Test for blank lines (for Array.filter())
isBlank = function(str) {
    return str.trim() !== '';
};

// Remove surrounding quotes

// RegExp pattens for file parsing

var regexes = {
    time: /[0-9]{1,2}:[0-9]{2}/,
};

parseTTXGood = function(contents) {
    var count = 0;
    var lines = contents.split('\n').map(line => {return line.trim();});
    var exported = new Date(lines.shift());
    console.log("exported:", exported);
    // Remove the rest of the header
    lines = lines.slice(4);
    // And footer
    lines.pop();
    lines.pop();
    var eventBlobs = [[]];
    lines.forEach(function (line) {
        if(line != '') {
            if (count >= 8) {
                eventBlobs.push([]);
            }
            eventBlobs[eventBlobs.length - 1].push(line);
            count = 0;
        } else {
            count++;
        }
    });
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
        console.log(blob[0])
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
            thisEvent.onsite = details[0];
        }
        thisEvent.number = details[1].slice(1,6);
        thisEvent.name = details[1].slice(6);
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
                thisEvent.resources[thisEvent.resources.length - 1].notes = words[0];
            }
        });
        console.log('This event:', thisEvent);
        events.push(thisEvent);
    });
    console.log(events);
};


/*  Validate a line string against another string or using a function
    Args:
        str: String to Validate
        check: Either a string to compare (for perfect match), a RegExp to match,
               or a function to call, using str as the only argument.
        lineNumber: For error generation
        expectedStr: For error generation, what to say was expected
    Return: Original string or RegExp match or return value of chec function
 */
var expect = function(str, check, lineNumber, expectedStr) {
    var errString = 'Line '+lineNumber+' expected ';
    if (check instanceof RegExp) {
        if (check.test(str)) {
            return str.match(check);
        } else {
            throw Error(errString+'"'+expectedStr+'"');
        }
    } else if (check instanceof Function) {
        if (check(str)) {
            return check(str);
        } else {
            throw Error(errString+'"'+expectedStr+'"');
        }
    } else {
        throw Error("Validation argument error");
    }
};

parseTTX = function(contents) {
    lines = contents.split('\n').filter(isBlank);
    words = lines.map(function(line) {
        return line.trim().split('\t').map(function(word) {
            /*return word.replace(/^"?(.+?)"?$/,'$1')*/
            return s.trim(word, '"');
        });
    });
    console.log(words);
    var state = {};
    var events = [];
    var num = 0;
    let exported = new Date(expect(words[num].join(' '), Date.parse, num, 'Date'));
    console.log('Exported: ', exported);
    num += 3;
    if (Date.parse(words[num][0].split('-')[0])) { num++; }
    var perBuilding = true;
    var perDate = true;
    var perEvent = true;
    var perResource = true;
    console.log('Per Building: ', words[num].join(' '));
    while(perBuilding) {
        let building = words[num][0];
        console.log('Building: ', building);
        num++;
        console.log('Validating: ', expect(words[num][0], /Audio\/Visual Services/, num));
        num++;
        perDate = true;
        while (perDate) {
            state.date = new Date(expect(words[num][0], Date.parse, num, 'Date'));
            num += 3;
            perEvent = true;
            while (perEvent) {
                let thisEvent = {};
                thisEvent.exported = exported;
                thisEvent.building = building;
                let start = words[num][0].split(':');
                let end = words[num][1].split(':');
                thisEvent.timeStart = new Date(state.date);
                thisEvent.timeStart.setHours(...start);
                thisEvent.timeEnd = new Date(state.date);
                thisEvent.timeEnd.setHours(...end);
                thisEvent.space = words[num][2];
                num++;
                if (words[num][0].substr(0,6) == 'Onsite') { thisEvent.onsite = words[num][0].substr(8); }
                thisEvent.eventNumber = words[num][1].match(/#([0-9]{5})/)[1];
                thisEvent.name = words[num][1].substr(7);
                if (words[num][2]) { thisEvent.contact = words[num][2]; }
                num += 2;
                let resources = [];
                perResource = true;
                while (perResource) {
                    let thisResource = {};
                    if (words[num][2] == "EA" && parseFloat(words[num][1])) {
                        // Line is a resource
                        thisResource.quantity = parseFloat(words[num][1]);
                        thisResource.name = words[num][3];
                        num++;
                    } else if (words[num][0].match(regexes.time)) {
                        // Line starts with a time, indicating a new event
                        perResource = false;
                        break;
                    } else if (Date.parse(words[num][0])) {
                        // Line is a Date, indicating a new day, same building
                        perResource = false;
                        perEvent = false;
                        break;
                    } else if (words[num+1] == 'Audio/Visual Services') {
                        // Next Line is "Audio/Visual Service", indicating a new building report.
                        perDate = false;
                        perResource = false;
                        perEvent = false;
                        break;
                    } else {
                        // Unrecognized case, so just stop everything.
                        throw Error('Line '+num+': Unexpected: "'+words[num].join(' ')+'"');
                    }
                    // Now check for resource note
                    if (words[num+1] == 'Audio/Visual Services') {
                        // Need to check for new building again, since we've advanced one line, and
                        // there's no way to tell a building from a note (in this version).
                        // Don't break though, since we need to push the resource.
                        perDate = false;
                        perResource = false;
                        perEvent = false;
                    } else if (words[num].length == 1) {
                        thisResource.notes = words[num][0];
                        num++;
                    }
                    console.log('Resource: ', thisResource);
                    resources.push(thisResource);
                }
                thisEvent.resources = resources;
                events.push(thisEvent);
            }
        }
    }
    events.map(event => event.name).forEach(name => {
        console.log(name);
    });
    console.log(events);
};
