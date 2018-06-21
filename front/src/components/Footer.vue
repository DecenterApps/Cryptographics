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
        width: 100%;
        bottom: 0;
        background-color: black;
        height: 100px;
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