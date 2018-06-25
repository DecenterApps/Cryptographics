<template>
    <div>
        <canvas id="test" width="1000" height="1000"></canvas>
    </div>
</template>

<script>
    import methods from '../methods'

    export default {
        data:  () => ({
        }),
        props: ["objs"],
        watch: {
            'objs': (newObjs) => {
                console.log(newObjs);
                let c = document.getElementById("test");
                methods.makeImage(newObjs, c);
            }
        },
        methods: {
          getCanvasElement() {
              return document.getElementById("test");
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