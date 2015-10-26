function HttpLatency(params)
{
    var _arr = {"out":""};
    if(!params)
        params = {};
    for(var p in _arr) {
        if(!(p in this))
            this[p] = _arr[p];
        if(p in params)
            this[p] = params[p];
    }
    
    this.init();
}

HttpLatency.prototype.init = function() {
    var that = this;
    that.idx = 1;

    that.config = [ {  dataType: "script", cache: true, url: "/static/latency.js", times: 5}
    ];

    that.runitems = [];
    that.itemsById = {};
}

HttpLatency.prototype.queue = function(p, times) {
    var that = this;

    if(!times) times = 1;
    p.id = that.idx;
    p.results = [];
    that.itemsById[p.id] = p;

    for(var i=0; i < times; i++)
        that.runitems.push(p);

    that.idx = that.idx + 1;
}

HttpLatency.prototype.runQueue = function() {
    var that = this;

    var q = that.runitems.shift();
    if(!q)
        return;

    var id = q.id;
    $.ajax({
        url: q.url,
        dataType: q.dataType,
        cache: "cache" in q ? q.cache : true,
        beforeSend: function(xhr) {
            // Store the timestamp
            that.itemsById[id]["startTime"] = new Date().getTime();
        },

    })
    .done( function(data, textStatus, xhr) {
        console.log(xhr.status);
        console.log(xhr.getAllResponseHeaders());
        var now = new Date().getTime();
        var item = that.itemsById[id];
        var diff = now - that.itemsById[id]["startTime"]
        that.itemsById[id]["results"].push({size: data.length, duration: diff})
        $(that.out).html( $(that.out).html() + "<br>" + "Url: " + item.url + " Time:" + diff );

        setTimeout(function() { that.runQueue(); }, 1);
    });
}

HttpLatency.prototype.start = function() {
    var that = this;

    for(var i in that.config) {
        var cfg = that.config[i];

        var p = { url: cfg.url, dataType: cfg.dataType, cache: cfg.cache };
        that.queue(p, cfg.times);
    }

    that.runQueue();
}

lat = new HttpLatency({out: "#output"});

$(document).ready( function() {

    $("#start").unbind("click").click( function() {
        lat.start();

    });

});