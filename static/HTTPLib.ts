export class HTTPLib {
    public static get(url: string, data: {[index: string]: any}, callback: (text: string) => void) {
        let realurl = url + "?";
        for(let key in data) {
            realurl += encodeURIComponent(key) + "=" + encodeURIComponent(data[key]) + "&";
        }
        realurl = realurl.substring(0, realurl.length - 1);
        let httpRequest = new XMLHttpRequest();
        httpRequest.overrideMimeType("application/json");
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
                callback(httpRequest.responseText);
        };

        httpRequest.open("GET", realurl, true);
        httpRequest.send(null);
    }

    public static post(url: string, data: {[index: string]: any}, callback: (text: string) => void) {
        let httpRequest = new XMLHttpRequest();
        httpRequest.overrideMimeType("application/json");
        httpRequest.onreadystatechange = function () {
            if(httpRequest.readyState == 4 && httpRequest.status == 200)
                callback(httpRequest.responseText);
        };
        httpRequest.open("POST", url, true);
        httpRequest.send(data);
    }
}
