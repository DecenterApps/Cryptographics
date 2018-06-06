<template>
    <div>
        <button id="button" @click="onClick"> Iteration : {{ iteration }}</button>
        <label id="randomSeed"> Random seed : {{ random_seed }}</label>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'

    const imgFunctions = require('../../scripts/imgFunctions.js');
    const methods = require('../methods.js');


    function makeImage(objs) {
        let c = document.getElementById("test");
        let context = c.getContext('2d');
        context.clearRect(0, 0, 1000, 1000);
        context.strokeRect(0, 0, 1000, 1000);
        let images = [];
        for(let i=0; i<objs.length; i++) {
            let image = new Image();
            let val = objs[i].id;
            if(val < 10) {
                val = "0" + val;
            }
            image.src = '../dist/assets/' + val + '.png';

            images.push(image);
        }

        for(let j=0; j<objs.length; j++) {
            images[j].onload = function () {
                let x = objs[j].x_coordinate %1000;
                let y = objs[j].y_coordinate %1000;
                let rotation = objs[j].rotation;

                methods.drawImageRot(context,images[j],x,y,250,250,rotation);
            }
        }

    }
    @Component({})
    export default class Button extends Vue {
        iteration = 0;
        random_seed = Math.floor(Math.random() * 10000);
        potential_assets = [ '0x000000000100000200000300000400000500000600000700000800000900000a',
            '0x000000000b00000c00000d00000e00000f000010000011000012000013000014' ];
        async onClick(){
            // if(this.iteration == 0) {
            //     this.random_seed = await imgFunctions.calculateFirstSeed();
            // }
            let objs = await methods.getData(this.random_seed, this.iteration, this.potential_assets);
            this.iteration++;
            makeImage(objs);
        }
    }

</script>

<style lang="scss">
    button {
        width: 200px;
        height: 50px;
        margin-left: 400px;
    }
</style>