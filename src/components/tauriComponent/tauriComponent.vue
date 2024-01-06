<script>
  import { ref } from "vue";
  import { invoke } from "@tauri-apps/api/tauri";

  export default {
    setup() {
      console.log('Tauri component called')
    },
    data: () => ({

    }),
    props: {
      jsonUrl: String,
      jsonDatas: String
    },
    watch: {

    },
    methods: {
      getJson(source) {
        console.log('Call GETJSON'+source)
        return 'GETJSON'
      },
      setJson(source) {

      },
      uploadPicture() {

      }
    },
    created() {
      //this.$root.$refs.getJson = this;
    }
  }
  
</script>

<template>
  <!-- null -->
</template>