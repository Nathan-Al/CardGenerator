<script lang="js">
  import { ref } from "vue";
  import { isProxy, toRaw } from 'vue';
  import { invoke } from "@tauri-apps/api/tauri";
  import { exists, BaseDirectory, copyFile } from '@tauri-apps/api/fs';
  import { open } from "@tauri-apps/api/dialog";
  import { convertFileSrc } from '@tauri-apps/api/tauri';
  import manuelComponent from "../manuelComponent/manuelComponent.vue";

  export default {
    async created() {
      let fisrtKeyPressed = false
      let secondKeyPressed = false
      await this.sendCardDataToView()

      window.addEventListener('keydown', async (event) => {
        if(event.key == 'Control') {
          fisrtKeyPressed = true
        }
      })
      window.addEventListener('keyup', async (event) => {
        if(event.key == 'Enter') {
            await this.sendCardDataToView()
          }
          if(event.key == 's') {
            secondKeyPressed = false
          }
          if(event.key == 'Control') {
            fisrtKeyPressed = false
          }
      })
      window.addEventListener('keypress', async (event) => {
        if(event.key == 's' && fisrtKeyPressed && !secondKeyPressed || event.key == "\x13") {
          fisrtKeyPressed = false
          secondKeyPressed = true
          this.saveCardData()
        }
      })
    },
    data: () => ({
      cardTitle: ref(''),
      cardContent: ref(''),
      imgCardsrc: ref(''),
      imageSrc: ref(''),
      cardButtonText: ref(''),
      dataJson: ref(''),
      imageContent: ref(''),
      // ---------------------------------
      isChangeImage: false,
      isChangeTitle: false,
      isChangeContent: false,
      isChangeButton: false,
      changeOccured: false
    }),
    components: {
      manuelComponent
    },
    methods: {
      async imageHandler() {
        let response = await this.changeCardImage()
        if(response) {
          this.imgCardsrc = response
        } else {
          console.log(' - ERROR : Unable to use that file or the user didn\'t pick one')
          return response
        }
        if(!this.imgCardsrc) return
        this.isChangeImage = true
        this.changeOccured = true
      },
      async changeCardImage () {
        let selected = null
        try {
          selected = await open({
            multiple: false,
            title: "Choose a Picture",
            filters: [{
              name: "Images",
              extensions: ["png", "webp", "jpg", "jpeg"]
            }]
          })
          if(selected === null) return false;
          this.imageSrc = selected
        } catch (error) {
          console.log(` - ERROR : ${error}`)
          return false
        }

        let convertedImgUrl = convertFileSrc(selected);
        return convertedImgUrl
      },
      async sendCardDataToView() {
        if(await this.getJson() == false) {
          window.alert('ERROR : Unable to get the application datas')
        }
        this.imgCardsrc = this.dataJson.image[Math.floor(Math.random() * this.dataJson.image.length)]
        this.cardTitle = this.dataJson.titre[Math.floor(Math.random() * this.dataJson.titre.length)]
        this.cardContent = this.dataJson.text[Math.floor(Math.random() * this.dataJson.text.length)]
        this.cardButtonText = this.dataJson.button[Math.floor(Math.random() * this.dataJson.button.length)]
      },
      async saveCardData () {
        if(this.changeOccured) {
          this.isChangeImage? this.dataJson.image.push(this.imgCardsrc): null
          this.isChangeTitle? this.dataJson.titre.push(this.cardTitle): null
          this.isChangeContent? this.dataJson.text.push(this.cardContent): null
          this.isChangeButton? this.dataJson.button.push(this.cardButtonText): null
          if(this.isChangeImage) {
            if(!this.uploadPicture()) {
              this.dataJson.image.pop()
              console.log(' - ERROR : Fail to upload file')
            }
          }

          let datasJsonToSend = JSON.stringify(this.dataJson)
          invoke('set_json', {data: datasJsonToSend})
          .then((response) => {
            if(response){
              console.log(` - RESPONSE : Save OK ${response}`)
              this.getJson()
              this.sendCardDataToView()
            }
            else
              console.log(` - ERROR : ${response}`)
          })
        }
      },
      async getJson() {
        await invoke('get_json')
        .then((response) => {
          this.dataJson = isProxy(JSON.parse(response)) ? JSON.parse(response) : toRaw(JSON.parse(response))
          return true
        })
        .catch((error) => {
          console.log(` - ERROR : ${error}`)
          return false
        })
      },
      async uploadPicture () {
        if(await exists('img', { dir: BaseDirectory.AppLocalData })) {
          try {
            let nameFile = Math.random().toString(36).substring(2,20).replaceAll('.','')
            if(await copyFile(this.imageSrc, `img/${nameFile}.png`, { dir: BaseDirectory.AppLocalData }) == null) {
              return true
            } else {
              console.log(' - ERROR : Can\'t copy the file')
            }
          } catch (error) {
            console.log(` - ERROR : ${error}`)
            return false
          }
        } else {
          console.log(' - ERROR : The application directory picture dosen\'t exist')
        }
      },
      mother () {
        console.log('ME')
      }
    }
  }

</script>

<template>
  <div class="card" id="card">
    <manuelComponent />
    <div class="divImg">
        <label for="imgCardInput">
          <img :src=this.imgCardsrc alt="" srcset="" id="contrImg">
          <button name="imgCard" id="imgCardInput" @click="imageHandler"></button>
        </label>
    </div>
    <div class="content center">
      <div class="title center">
        <textarea @change="isChangeTitle = true, changeOccured = true" v-model=cardTitle name="contratTitle" id="contratTitleTextArea" spellcheck="false"></textarea>
      </div>
      <div class="text center">
        <textarea @change="isChangeContent = true, changeOccured = true" v-model=cardContent name="contrat" id="contratContent" spellcheck="false"></textarea>
      </div>
      <div class="end center">
        <button class="center validateButton" type="submit" id="straightToHell">
          <textarea @change="isChangeButton = true, changeOccured = true" v-model=cardButtonText class="center" name="buttonText" id="buttonText" cols="1" rows="1" wrap="hard" spellcheck="false"></textarea>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card {
    background-color: rgb(255, 255, 255);
    flex-direction: column;
    height: 80vh;
    width: 50vh;
    border-radius: 4%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  
  .card .divImg {
    width: 100%;
    height: 60%;
    border-radius: 4%;
    position: relative;
    box-shadow: -4px 2px 8px 0 rgb(0 0 0 / 20%), -2px 5px 20px 0 rgb(0 0 0 / 19%);
  }
  
  .card .divImg form {
    height: 100%;
    width: 100%;
    padding: 0%;
    margin: 0%;
  }
  
  .card .divImg label {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
  }
  
  .card .divImg label img {
    width: 100%;
    height: auto;
    padding: 0;
    margin: 0;
    background-color: black;
    object-fit: cover;
    border-radius: 4% 4% 0% 0%;
    cursor: pointer;
  }
  
  .card .divImg label button {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    display: none;
  }
  
  .card .title {
    height: 20%;
    margin-top: 5% !important;
    padding: 0 !important;
    font-family: system-ui;
    width: 100%;
  }
  
  .card .title textarea {
    width: 100%;
    height: 100%;
    border: 0px;
    scroll-behavior: unset;
    overflow: hidden;
    resize: none;
    display: block;
    text-align: center;
    font-size: 1.5em;
    text-overflow: ellipsis;
    font-weight: bold;
    font-family: system-ui;
  }
  
  .card .content {
    height: 40%;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    max-width: 100%;
    padding: 0%;
  }
  
  .card .text {
    width: 90%;
    height: 50%;
    margin-left: 2%;
    margin-right: 2%;
    padding: 0 !important;
    text-align: center;
  }
  
  .card .text textarea {
    width: 100%;
    min-height: 10vh;
    text-overflow: ellipsis;
    font-size: 1em;
    font-family: sans-serif;
    border: 0px;
    scroll-behavior: unset;
    overflow: hidden;
    resize: none;
  }
  
  .card .end {
    height: 25%;
    max-height: 30%;
    width: 100%;
    margin: 2% !important;
    padding: 0 !important;
  }
  
  /* ----------- */
  
  .conteneur-fl {
    background-color: #9c000096;
  }
  
  .validateButton {
    width: 65%;
    height: 100%;
    padding: 0;
    background-color: rgb(36, 36, 36);
    color: white;
    border: 0;
    border-radius: 8px;
    cursor: pointer;
    transition: 1.5s;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
  .validateButton:hover {
    background-color: rgb(255, 255, 255);
    transition: 2s;
    border: 1px solid black;
  }
  
  .validateButton:active {
    box-shadow: rgba(0, 0, 0, 0.63) 0px 5px 15px;
    background-color: #b31616;
    transition: 0.2s;
  }
  .validateButton textarea {
    height: 40%;
    width: 100%;
    margin: 0;
    padding: 1%;
    border: 0;
    border-radius: 8px;
    color: white;
    text-align: center;
    text-overflow: ellipsis;
    font-size: 1.2em;
    font-family: sans-serif;
    scroll-behavior: unset;
    overflow: hidden;
    resize: none;
    vertical-align: middle;
    background-color: #00000000;
  }
  .validateButton textarea:hover {
    color: black;
    transition: 2s;
  }

  @media only screen and (max-width: 350px) {
    .card {
      width: 90%;
      height: 70%;
    }
  }
</style>