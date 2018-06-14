<template>
    <div>
        <canvas id="mojeslike" width="1000" height="1000"></canvas>
    </div>
</template>

<script>
    import methods from '../methods'

    export default {
        data:  () => ({
        }),
        props: ["myObjs"],
        watch: {
            'myObjs': (newObjs) => {
                let c = document.getElementById("mojeslike");
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