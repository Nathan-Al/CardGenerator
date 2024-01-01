const { invoke } = window.__TAURI__.tauri

const cardImg = document.getElementById('contrImg')
const cardTitle = document.getElementById('contratTitleTextArea')
const cardContent = document.getElementById('contratContent')
const imgCardInput = document.getElementById('imgCardInput')
const contrImg = document.getElementById('contrImg')
const buttonSave = document.getElementById('straightToHell')
// -----------
let urlCardImage = ''
let jsonDatas = null
// -------------------a supp
let debugTitle = document.getElementById('debug')

window.onload = async function() {
    await getJson().then(
        function(value) {
            generateCardInfo(value)
            jsonDatas = value
        },
        function (error) { 
            console.log(error)
         }
    )
};

async function generateCardInfo(cardContent) {
    cardImg.src = cardContent.image[Math.floor(Math.random() * cardContent.image.length)]
    cardTitle.value = cardContent.titre[Math.floor(Math.random() * cardContent.titre.length)]
    cardContent.value = cardContent.text[Math.floor(Math.random() * cardContent.text.length)]
    buttonSave.innerText = cardContent.button[Math.floor(Math.random() * cardContent.button.length)]
}

imgCardInput.addEventListener('click', function () {
    imgCardInput.onchange = async () => {
        urlCardImage = URL.createObjectURL(imgCardInput.files[0])
        contrImg.setAttribute('src', urlCardImage)
    }
})

buttonSave.addEventListener('click', async function () {
    jsonDatas.image.push(urlCardImage)
    debugTitle.innerText = 'addventlistener'
    await setJson(jsonDatas).then(
        async function(value) {
            window.header.innerHTML = value
            await getJson().then(
                function(value) {
                    generateCardInfo(value)
                    jsonDatas = value
                },
                function (error) { 
                    console.log(error)
                 }
            )
        },
        function (error) {
            window.header.innerHTML = 'ERROR : : '+error
        }
    )
})

async function getJson() {
    let data = null
    //return fetch('../../json/datas.json')
    await invoke('get_json')
    .then((response) => {
        data = JSON.parse(response)
    })
    return data
}


async function setJson(datas) {
    //datasJson = JSON.stringify(datas)
    debugTitle.innerText = 'setJson'
    // invoke('greet', {name: ''})
    // .then((response) => {
    //     debugTitle.innerText = 'Response : '+response
    // })
    invoke('greet', { name: 'World' })
    // `invoke` returns a Promise
    .then((response) => {
        debugTitle.innerText = 'res'+response
    })
}

async function fetch(url) {
    let request = new XMLHttpRequest()
    let dataReceiv

    request.open('GET', url, false)
    try {
        request.send()
        dataReceiv = JSON.parse(request.response)
    } catch (error) {
        console.log(error)
    }

    return dataReceiv
}
