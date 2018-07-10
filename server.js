
const appInsights = require("applicationinsights");
appInsights.setup("1e437300-413c-481c-a1f7-f7b9c4dfa392")
.setAutoDependencyCorrelation(true)
.setAutoCollectRequests(true)
.setAutoCollectPerformance(true)
.setAutoCollectExceptions(true)
.setAutoCollectDependencies(true)
.setAutoCollectConsole(true)
.setUseDiskRetryCaching(true)
.start();

/* require('appdynamics').profile({
    controllerHostName: 'apmgctrl003.pwc.com',
    controllerPort: 443,
    controllerSslEnabled: true,  // Set to true if controllerPort is SSL
    accountName: 'customer1',
    accountAccessKey: 'ceeddede-c311-4d30-8466-2f2fa2c9f87b',
    applicationName: 'Test_Poc_Azure',
    tierName: 'choose_a_tier_name',
    nodeName: 'choose_a_node_name'
}); */

/* require("appdynamics").profile({
    controllerHostName: 'paid237.saas.appdynamics.com',
    controllerPort: 443, 
    
    // If SSL, be sure to enable the next line
    controllerSslEnabled: true,
    accountName: 'pricewaterhousecoopersgloballicensingservicescorporation',
    accountAccessKey: '5f7jelcb0y4v',
    applicationName: 'NodeJSTest',
    tierName: 'NodeJSTest',
    nodeName: 'process' // The controller will automatically append the node name with a unique number
}); */

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const router = require("./routes/pgindex");
const app = express();
const port = process.env.port || 3000;
const HOST = '0.0.0.0';


//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', `*`);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Routes
app.use("/api", router);
let start = Date.now();
app.listen(port, function(){
    console.log(`Running on http://${HOST}:${port}`);
    let duration = Date.now() - start;
	appInsights.defaultClient.trackMetric({name: "server startup time", value: duration});
});