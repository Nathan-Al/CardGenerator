<script lang="js">
  import { ref } from "vue";
  import { open } from "@tauri-apps/api/dialog";
  import { convertFileSrc } from '@tauri-apps/api/tauri';

  export default {
      props: [
        "imgCardsrc"
      ],
      data: () => ({
        imageSrc: ref('')
      }),
      methods: {
          async imageHandler() {
            try {
              let response = await this.changeCardImage()
              if(response) {
                this.$emit('response', {imgUrl: response, imgSelected: this.imageSrc})
                //this.imgCardsrc = response
              } else {
                console.log(' - ERROR : Unable to use that file or the user didn\'t pick one')
                return response
              }
              if(!this.imgCardsrc) return
              this.isChangeImage = true
              this.changeOccured = true
            } catch (error) {
              console.log(` - ERROR ${error}`)
            }
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
      }
  }
</script>

<template>
    <div class="divImg">
        <label for="imgCardInput">
          <img :src=this.imgCardsrc alt="" srcset="" id="contrImg">
          <button name="imgCard" id="imgCardInput" @click="imageHandler"></button>
        </label>
    </div>
</template>

<style lang="css">
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
</style>