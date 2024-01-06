<script>
    import axios from 'axios'
    export async function fetchApi(url) {
        axios
        .get(url)
        .then((response) => {
        console.log(response)
        })
    }
</script>

<template>
    <!-- NULL -->
</template>