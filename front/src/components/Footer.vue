<template>
    <footer>
        <div>
            <a href="/galery"> Gallery</a>
            <a href="/assetPacks"> Asset packs</a>
            <a href="/about"> About </a>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "footer"
    }
</script>

<style scoped>

    footer {
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