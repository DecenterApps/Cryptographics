<template>
    <header>
        <div>
            <a href="/galery"> Gallery</a>
            <a href="/assetPacks"> Asset packs</a>
            <a href="/about"> About </a>
        </div>
    </header>
</template>

<script>
    export default {
        name: "header"
    }
</script>

<style scoped>

    header {
        background-color: black;
        height: 100px;
        margin-top: 50px;
        margin-bottom: 50px;
    }

    div {
        padding-left: 200px;
    }

    a {
        display: inline-block;
        padding-top: 50px;
        color: azure;
        padding-left: 100px;
    }
</style>