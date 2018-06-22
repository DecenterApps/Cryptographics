<template>
    <footer>
        <div>
            <img src="http://localhost:3000/dist/logo.png"/>
            <label> Cryptographics </label>
            <a href="/home"> Home</a>
            <a href="/galery"> Gallery</a>
            <a href="/assetPacks"> Asset packs</a>
            <a href="/about"> About </a>
            <a href="/profile"> Profile </a>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "footer"
    }
</script>

<style scoped>

    label{
        font-size: 30px;
        color: white;
        height: 20.99px;
    }
    footer {
        width: 100%;
        bottom: 0;
        background-color: black;
        height: 100px;
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