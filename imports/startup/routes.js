Router.route('/upload', {
    name: 'upload',
    template: 'upload'
});

Router.route('/', {
    template: 'home',
});

Router.route('/cal/:date', function () {
    var date = this.params.date;
    if (Date.parse(date)) {
        dateObj = new Date(date);
        this.render('main', {
            data: {
                date: dateObj,
            }
        });
    }
    console.log(date);
});

Router.route('/cal', function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    this.redirect('/cal/' + year + '-' + month + '-' + day);
});
