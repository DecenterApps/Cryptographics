<template>
    <div>
        <button id="button" @click="onClick"> Iteration : {{ iteration }}</button>
        <label id="randomSeed"> Random seed : {{ random_seed }}</label>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'
    const methods = require('../methods.js');


    function makeImage(objs) {
        let c = document.getElementById("test");
        let context = c.getContext('2d');
        context.clearRect(0, 0, 1000, 1000);
        context.strokeRect(0, 0, 1000, 1000);
        console.log(objs.length)
        let images = [];
        for(let i=0; i<objs.length; i++) {
            let image = new Image();
            let val = objs[i].id;
            val = i < 10 ? "0" + val.toString() : val.toString();
            image.src = '../dist/assets/' + val + '.png';

            images.push(image);
        }
        for(let i=0; i<objs.length; i++) {
            images[i].onload = function () {
                let x = objs[i].x_coordinate %1000;
                let y = objs[i].y_coordinate % 1000;

                // let zoom = objs[i].zoom;
                let rotation = objs[i].rotation;
                methods.drawImageRot(context,images[i],x,y,250,250,rotation);
                // context.drawImage(images[i], x, y, 250, 250);
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