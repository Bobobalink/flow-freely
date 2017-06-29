var HTTP = HTTP || {};

HTTP.get = function (url, data, callback) {
    var realUrl = url + "?";
    for (key in data) {
        if (!data.hasOwnProperty(key)) continue;
        realUrl += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
    }
    realUrl = realUrl.substring(0, realUrl.length - 1);
    var httpRequest = new XMLHttpRequest();
    httpRequest.overrideMimeType("application/json");
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    };

    httpRequest.open("GET", realUrl, true);
    httpRequest.send(null);
};

HTTP.post = function (url, data, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.overrideMimeType("application/json");
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    };

    httpRequest.open("POST", url, true);
    httpRequest.send(data);
};
