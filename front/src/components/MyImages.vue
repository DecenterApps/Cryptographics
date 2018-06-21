<template>
    <div>
        <canvas id="myImagesCanvas" width="1000" height="1000"></canvas>
    </div>
</template>

<script>
    import methods from '../methods'
    const functions = require('../../scripts/functions.js');
    export default {
        data:  () => ({
        }),
        // props: ["image",
        // "allAssets"],
        props: ["myobjects"],
        watch: {
            "myobjects": (newObjs) => {
                console.log("WELL PASSED PROPS");
                let c = document.getElementById("myImagesCanvas");
                methods.makeImage(newObjs, c);
            }
        },
        // async beforeCreate() {
        //     let data = await functions.getImageMetadataFromContract(this.image);
        //     this.objs = await methods.getData(data[0], parseInt(data[1], 10), data[2], this.allAssets);
        //     let c = document.getElementById("myImagesCanvas");
        //     methods.makeImage(objs, c);
        // },
        methods: {

        },
    }
</script>


<style lang="scss">
    canvas {
        margin: 10px;
        width: 1000px;
        height: 1000px;

    }
</style>