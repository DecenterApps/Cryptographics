<template>
    <div>
        <canvas-image></canvas-image>
        <generator></generator>
    </div>

</template>

<script>
    import Canvas from './Canvas.vue';
    import Button from './Button.vue';

    export default {
        components: {
            'canvas-image' : Canvas,
            'generator' : Button
        }
    }
</script>


<style>


</style>