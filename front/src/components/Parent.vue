<template>
    <div>
        <canvas-image :objs="objs" ></canvas-image>
        <button @click="renderCanvas"> Iteration: {{ iterations }}</button>
        <input v-model = "potential_assets"/>
    </div>

</template>

<script>
    import Canvas from './Canvas.vue';
    const methods = require("../methods.js");
    const utils = require("../../scripts/utils.js");
    export default {
        data:  () => ({
            objs : [],
            allAssets :  [],
            iterations : 0,
            random_seed: 0,
            potential_assets: '1, 2, 3, 4, 5',
        }),
        components: {
            'canvas-image': Canvas,
        },
        methods: {
            async renderCanvas() {
                let pot = this.potential_assets.split(',').map(a => parseInt(a,10));
                this.objs = await methods.getData(this.random_seed, this.iterations, utils.encode(pot), this.allAssets);
                this.iterations++;
            }
        },
        async beforeCreate() {
            this.allAssets = await methods.loadDataForAssets();
            this.random_seed = Math.floor(Math.random()*10000);
            this.renderCanvas();
        }
    }
</script>


<style>


</style>