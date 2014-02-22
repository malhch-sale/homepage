require({
    waitSeconds: 0,
    map: {
        '*': {
            'css': 'require-css/css.min'
        }
    },
    paths: {
        moment: 'momentjs/moment',
        angular: 'angular/angular.min',
        d3: 'd3/d3.min'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        d3: {
            exports: 'd3'
        }
    },
    baseUrl: 'bower_components'
});

define('fancybox', [
    'fancybox/source/jquery.fancybox.pack',
    'css!fancybox/source/jquery.fancybox'
], function() {
    return $.fancybox;
});

define('tagsdata', ['config'], function(config) {
    var data, status, listeners = [];

    function fire() {
        listeners.forEach(function fn(row) {
            data ? row[0](data) : row[1]();
        });
    }

    return function(callback, errorCallback) {

        if (status === 'loaded') {
            data ? callback(data) : errorCallback();
        } else {
            listeners.push([callback, errorCallback]);

            if (!status) {
                status = 'loading';
                config.articlesTags(function success(res) {
                    status = 'loaded';
                    data = res;
                    fire();
                }, fire);
            }
        }
    };
});