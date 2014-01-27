require({
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

define('tagsdata', function() {
    var data;
    return function(callback, errorCallback) {
        if (data) return callback(data);

        $.ajax({
            url: 'http://localhost/api/articles/tags',
            success: function(res, status) {
                if (status === 'success') {
                    callback(data = res);
                } else {
                    $.isFunction(errorCallback) && errorCallback();
                }
            },
            error: errorCallback
        });
    };
});