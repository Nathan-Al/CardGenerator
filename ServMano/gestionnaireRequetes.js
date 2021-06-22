var querystring = require("querystring");
var fs = require("fs");
const path = require('path');
const tools = require('./outil');

const css = "css/index.css";
const mediasite = "img";
const scripts = 'scripts'
let cssDataPost = "";
let imageDataPost = "";

// Associe le type MIME par rapport au suffixe du fichier demandé
const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt'
};

async function receive(response, postData, pathname) {
    console.log("         ");
    console.log("Gestionnaire Requête : Le gestionnaire 'receive' est appelé.");
    console.log("Gestionnaire Requête : PostData : " + postData + "pathname : " + pathname);

    // if (path.parse(pathname).ext == ".css") {
    //     cssDataPost = path.parse(pathname).ext;
    // } else if (path.parse(pathname).ext == ".png" || path.parse(pathname).ext == ".jpg") {
    //     imageDataPost = path.parse(pathname).ext;
    // }

    if (pathname == "/" || pathname == "/menu" || pathname == "/accueil") {
        fs.readFile("index.html", "utf-8", (err, data) => {
            if (err) {
                response.writeHead(404)
                response.end("Ce fichier n'existe pas")
            } else {
                // extraction du suffixe de fichier selon le chemin basé sur l'URL fournie. ex. .js, .doc, ...
                const ext = path.parse("Views/affichage-menu.html").ext;

                // si le fichier est trouvé, définit le content-type et envoie les données

                response.setHeader('Content-type', mimeType[ext]);
                //response.writeHead(200, { 'Content-type': 'text/html' })
            }
            //console.log("Response : " + response);
            response.end(data);
        })

    } 
    
    if (path.parse(pathname).ext == ".css") {
        console.log("Gestionnaire Css : " + css);

        var fileStreamCss = await fs.createReadStream(css, "UTF-8");
        //response.writeHead(200, { "Content-Type": "text/css" })
        await fileStreamCss.pipe(response, { end: true });
        fileStreamCss.on('end', () => {
            fileStreamCss.destroy()
            response.end();
        });
    }       
    
    if (path.parse(pathname).ext == ".js") {
        console.log("Gestionnaire Script : " + scripts);
        let scriptPath = scripts + pathname;
        var fileStreamScript = await fs.createReadStream(scriptPath);

        await fileStreamScript.pipe(response, { end: true });
        fileStreamScript.on('end', () => {
            fileStreamScript.destroy()
            response.end();
        });
    } 
    
    if (path.parse(pathname).ext == ".png" || path.parse(pathname).ext == ".jpg") {

        console.log("Gestionnaire Image : " + mediasite + pathname);
        imgPathname = mediasite + pathname;
        console.log("Image path : "+imgPathname);
        //var fileStreamIm = await tools.LecteurFichiers.Fichier.lire(imgPathname)

        fileStreamIm = await fs.createReadStream(imgPathname);
        //response.writeHead(200, { "Content-Type": "image/png" })

        await fileStreamIm.pipe(response, { end: true });
        fileStreamIm.on('end', () => {
            fileStreamIm.destroy();
            response.end();
        });
        await fileStreamIm.on('exit', function (code) {
            process.exit('Image exit pipe : '+code);
          });
    }
}

function upload(response, postData) {
    console.log("Gestionnaire Requête : Le gestionnaire 'upload' est appelé.");
    response.writeHead(200, { "Content-Type": "text/plain" })
    response.write("Vous avez envoyé : " + querystring.parse(postData).text);
    response.end();
}

exports.receive = receive;
exports.upload = upload;