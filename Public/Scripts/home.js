const body = document.getElementById('body')
const cardImg = document.getElementById('contrImg')
const cardTextArea = document.getElementById('contratContent')
const imgCardInput = document.getElementById('imgCardInput')
const contrImg = document.getElementById('contrImg')
let urlCardImage = ''

imgCardInput.onchange = () => {
    urlCardImage = URL.createObjectURL(imgCardInput.files[0])
    contrImg.setAttribute('src', urlCardImage)
}
