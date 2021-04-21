// Listen on a specific host via the HOST environment variable
var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8084;

var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    // requireHeader: ['origin', 'x-requested-with'],
    // removeHeaders: ['cookie', 'cookie2']
    // redirectSameOrigin: true,
    handleInitialRequest: (req, res, location, proxy, proxyRequest, isValidHostName) => {
        // console.log(req);
        const server = "http://localhost:8084";
        const url = "https://www.google.com";
        if (location && location.href) {
            if (!/^\/https?:/.test(req.url) && !isValidHostName(location.hostname)) {
                // console.log(`\ninvalid host: ${location.href}`);
                // rewrite URL
                // const request = new Request(`${url}/${location.href.replace(/(^\w+:|^)\/\//, '')}`);
                // console.log(`new URL: ${request.url}\n`)
                // proxyRequest(request, res, proxy);
                // console.log(req)
                // return true;
              }
            // console.log(location.href);
            // var x = new XMLHttpRequest();
            
            // const splitUrl = url.split("/");
            // const baseUrl =
            //     splitUrl.length > 3 ? splitUrl.slice(0, 3).join("/") : url;
            // x.open("GET", `${server}/${url}`);
            // // I put "XMLHttpRequest" here, but you can use anything you want.
            // x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            // x.setRequestHeader("Access-Control-Allow-Origin", "*");
        }
        // return true;
    },
    // httpProxyOptions: {
    //     changeOrigin: true
    // }
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
