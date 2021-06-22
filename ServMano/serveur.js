let http = require('http');
let url = require('url');
var gstr = require('./gestionnaireRequetes');
//var router = require('./router')
// var liens = require("../Outil/lecteur-liens.js");
// var fileServer = new nStatic.Server(liens.array_racine[2] + liens.liens_css_menu);

//let server = http.createServer()

function start(port, route, handle) {
    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;
        console.log("         ");
        console.log("---------");
        console.log("Serveur : Requete reçue pour le chemin " + pathname + ".")
        request.setEncoding("utf8");

        request.addListener("data", function(postDataChunk) {
            postData += postDataChunk;
            console.log("Serveur : Paquet POST recu" + postDataChunk + ".");
        });
        request.addListener("end", function() {
            console.log("Serveur : Pathname : " + pathname + ". handle : " + typeof(handle) + ".");
            gstr.receive(response,postData,pathname)
            //router.route(handle, pathname, response, postData)
        });
    }

    http.createServer(onRequest).listen(port);
    console.log("Serveur : Demarrage serveur");
}

exports.start = start;