<script>
export default {
  methods: {
    moveInfo () {
      let divInfo = document.getElementById('divInfo')
      if(divInfo.style.left == '0%')
        divInfo.style.left = '-18%'
      else
        divInfo.style.left = '0%'
    }
  }
}
</script>
<template>
  <div class="mainInfo" id="divInfo" style="left: 0%;">
    <div class="mainInfoText">
      <h2>How to use ?</h2>
      <div>
          <p>To save the picture and the text you use</p>
          <p class="strong">Ctrl+S</p>
      </div>
      <div>
        <p>To generate a new card you use</p>
        <p class="strong">Enter</p>
      </div>
      <p>PS evertime the info are random</p>
      <p>You good to go ^ ^</p>
    </div>
    <div class="center mainInfoCommand" @click="moveInfo">
      <font-awesome-icon icon="ellipsis-vertical" />
    </div>
  </div>
</template>

<style scoped>
.mainInfo {
  display: flex;
  position: absolute;
  width: 20vw;
  height: auto;
  top: 10vh;
  border: 1px solid black;
  transition: 0.6s;
}
  .mainInfoText {
    width: 90%;
    padding-left: 2%;
    border-left: 0;
    background-color: #d3f515;
    font-size: 0.9em;
    font-family: sans-serif;
    transition: 1s;
  }
  .mainInfoText div {
    margin-top: 5%;
  }
  .mainInfoText div p {
    margin: 0;
  }
  .mainInfoCommand {
    height: auto;
    width: 10%;
    cursor: pointer;
    background-color: rgb(255, 255, 255);
    border-left: 1px solid black;
    transition: 0.5s;
  }
  .mainInfoCommand:hover {
    color: white;
    background-color: black;
    transition: 0.6s;
  }
</style>