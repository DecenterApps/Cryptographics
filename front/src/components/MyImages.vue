<template>
    <div>
        <canvas id="myImagesCanvas" width="1000" height="1000"></canvas>
    </div>
</template>

<script>
    import methods from '../methods'

    export default {
        data:  () => ({
        }),
        props: ["myobjects"],
        watch: {
            "myobjects": (newObjs) => {
                console.log("WELL PASSED PROPS");
                let c = document.getElementById("myImagesCanvas");
                methods.makeImage(newObjs, c);
            }
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