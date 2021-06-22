let inputImage = document.getElementById('inputImage');
let inputTitre = document.getElementById('inputTitre');
let inputDesc = document.getElementById('inputDesc');
let inputButton = document.getElementById('inputButton');
let inputButtonSave = document.getElementById('buttonSave');

let htmlTitle = document.getElementById('titre');
let htmlImg = document.getElementById('img');
let htmlDescription = document.getElementById('description');
let htmlButton = document.getElementById('button');

inputButtonSave.addEventListener('click', function(e){
    htmlImg.src = inputImage.value;
    htmlTitle.innerText = inputTitre.value;
    htmlDescription.innerText = inputDesc.value;
    htmlButton.innerText = inputButton.value;
})