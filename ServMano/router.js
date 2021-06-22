function route(handle, pathname, response, postData) {
    console.log("         ");
    console.log("Router : Début du traitement de l'URL Pathanme : " + pathname + ".");
    console.log(handle)
    if (typeof handle[pathname] === 'function') {
        let namefunction = handle[pathname];
        namefunction(response, postData, pathname);
    } else {
        console.log("         ");
        console.log("Router : Aucun gestionnaire associé a " + pathname);
        response.writeHead(404, { "Content-type": "text/html; charset=utf-8" });
        response.write("404 Non trouvé");
        response.end();
    }
}
exports.route = route;