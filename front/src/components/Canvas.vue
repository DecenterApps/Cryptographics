<template>
    <div>
        <canvas id="test" width="1000" height="1000"></canvas>
    </div>
</template>

<script>
	const functions = require('../../scripts/imgFunctions');
	const utils = require('../../scripts/utils');

    function makeImage() {
        let c = document.getElementById("test");
        let context = c.getContext('2d');
        context.strokeRect(0, 0, 1000, 1000);

        let images = [];
        for (let i = 1; i < 21; i++) {
            let image = new Image();
            let val = i < 10  ? "0"+i.toString():i.toString();
            image.src = '../dist/assets/' + val + '.png';

            console.log(image.src);
            images.push(image);
        }
        for (let i = 0; i < images.length; i++) {
            images[i].onload = function () {
                let x = Math.floor(Math.random() * 1000);
                let y = Math.floor(Math.random() * 1000);
                context.drawImage(images[i], x, y, 250, 250);
            }
        }
    }

    export default {
        mounted : function(){
            makeImage();
        }
	}	
</script>


<style lang="scss">
	canvas {
		margin: 10px;
        width: 1000px;
        height: 1000px;

	}
</style>