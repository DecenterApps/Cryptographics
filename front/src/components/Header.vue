<template>
    <header>
        <div>
            <img src="http://localhost:3000/dist/logo.png" />
            <label> Cryptographics </label>
            <router-link to="/"> Home</router-link>
            <router-link to="/galery"> Gallery</router-link>
            <router-link to="/assetPacks"> Asset packs</router-link>
            <router-link to="/about"> About </router-link>
            <router-link to="/profile"> Profile </router-link>
        </div>
    </header>
</template>

<script>
  export default {
    name: 'header'
  };
</script>

<style scoped>


    label {
        font-size: 30px;
        color: white;
        height: 20.99px;
    }

    header {
        background-color: black;
        height: 100px;
        margin-bottom: 50px;
    }

    div {
        padding-left: 200px;
    }

    a {
        font-family: Roboto;
        font-style: normal;
        font-size: 12px;
        align: left;
        display: inline-block;
        padding-top: 50px;
        color: azure;
        padding-left: 100px;
    }


</style>