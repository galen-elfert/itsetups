// Generate some fake events, for testing

export default function testParser(input) {
    return {
        events: [{
            building: 'Harbour Centre',
            space: 'HC 1325',
            timeStart: new Date('Mon Apr 02 2016 09:00:00'),
            timeEnd: new Date('Mon Apr 02 2016 11:00:00'),
            eventName: 'Test Event',
            eventNumber: 22222,
            metadata: {
                source: 'csv',
                exported: new Date('Mar 29 2016')
                }
            }],
        buildings: new Set(['Harbour Centre']),
        dateFirst: new Date('Mon Apr 02 2016 09:00:00'),
        dateLast: new Date('Mon Apr 02 2016 11:00:00'),
        exported: new Date('Mar 29 2016')
    };
}
