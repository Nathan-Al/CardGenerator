//const { invoke } = window.__TAURI__.tauri

// ------------------
const cardImg = document.getElementById('contrImg')
const cardTitle = document.getElementById('contratTitleTextArea')
const cardContent = document.getElementById('contratContent')
const imgCardInput = document.getElementById('imgCardInput')
const contrImg = document.getElementById('contrImg')
const buttonSave = document.getElementById('straightToHell')
const imageForm = document.getElementById('formImage')
// ------------------
let urlCardImage = null
let newTitle = null
let newContent = null
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

imageForm.addEventListener('submit', function(e) {
    e.preventDefault()
});

async function generateCardInfo(cardDatas) {
    cardImg.src = cardDatas.image[Math.floor(Math.random() * cardDatas.image.length)]
    cardTitle.value = cardDatas.titre[Math.floor(Math.random() * cardDatas.titre.length)]
    cardContent.value = cardDatas.text[Math.floor(Math.random() * cardDatas.text.length)]
    buttonSave.innerText = cardDatas.button[Math.floor(Math.random() * cardDatas.button.length)]
}

imgCardInput.addEventListener('click', function () {
    imgCardInput.onchange = async () => {
        urlCardImage = URL.createObjectURL(imgCardInput.files[0])
        contrImg.setAttribute('src', urlCardImage)
    }
})

cardTitle.onchange = () => {
    newTitle = cardTitle.value
}

cardContent.onchange = () => {
    newContent = cardContent.value
}

buttonSave.addEventListener('click', async function () {
    if(urlCardImage !== '' && urlCardImage !== null) {
        jsonDatas.image.push(urlCardImage)
    }
    if(newTitle !== ''&& newTitle !== null) {
        jsonDatas.titre.push(newTitle)
    }
    if(newContent !== '' && newContent !== null) {
        jsonDatas.text.push(newContent)
    }
    if(urlCardImage !== null || newTitle !== null || newContent !== null) {
        if(uploadPicture()) {
            // setJson(jsonDatas).then(
            //     async function() {
            //         await getJson().then(
            //             function(value) {
            //                 generateCardInfo(value)
            //                 jsonDatas = value
            //             },
            //             function (error) { 
            //                 console.log(error)
            //              }
            //         )
            //     },
            //     function (error) {
            //         window.header.innerHTML = 'ERROR : : '+error
            //     }
            // )
        } else {
            console.log('Fail upload file')
        }
    } else {
        generateCardInfo(jsonDatas)
    }
})

async function getJson() {
    // let data = null
    // await invoke('get_json')
    // .then((response) => {
    //     data = JSON.parse(response)
    // })
    // return data
    return await fetch('../../json/datas.json')
}

async function setJson(datas) {
    datasJson = JSON.stringify(datas)
    debugTitle.innerText = 'setJson : '+datasJson
    invoke('insert_json', {data: datasJson})
    .then((response) => {
        debugTitle.innerText = 'Response : '+response
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

async function uploadPicture() {
    const files = document.querySelector('[name=imgCard]').files
    const formData = new FormData()
    formData.append('picture', files[0])
    try {
        const files = document.querySelector('[name=imgCard]').files
        const formData = new FormData()
        formData.append('picture', files[0])
    
         // post form data
        const xhr = new XMLHttpRequest()
    
        // log response
        xhr.onload = () => {
            console.log(xhr.responseText)
        }
        console.log(formData)
        // create and send the reqeust
        xhr.open('POST', '../../src/assets/img/')
        xhr.send(formData)
        return true
    } catch (error) {
        return false
    }
}