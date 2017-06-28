var HTTP = HTTP || {};

HTTP.get = function (url, data, callback) {
    var realUrl = url + "?";
    for(key in data) {
        if(!data.hasOwnProperty(key)) continue;
        realUrl += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
    }
    realUrl = realUrl.substring(0, realUrl.length - 2);
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    };

    httpRequest.open("GET", realUrl, true);
    httpRequest.send(null);
};

HTTP.put = function (url, data, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if(httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    };

    httpRequest.open("PUT", url, true);
    httpRequest.send(data);
};
