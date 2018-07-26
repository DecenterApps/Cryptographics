<template>
    <button 
        class="button ico-button"
        v-bind="$attrs"
        v-on="$listeners">
        <ico-download v-if="iconType === 'download'" :width="width" :height="height" :color="color"/>
        <ico-magnifier v-if="iconType === 'zoom'" :size="size" :color="color"/>
    </button>
</template>

<script>
import IcoDownload from './Icons/IcoDownload.vue';
import IcoMagnifier from './Icons/IcoMagnifier.vue';

export default {
    name: 'ButtonIcon',
    props: {
        iconType: {
            type: String,
            default: 'download'
        },
        color: {
            type: String
        },
        size: {
            type: String
        },
        width: {
            type: String
        },
        height: {
            type: String
        }
    },
    components: {
        IcoDownload,
        IcoMagnifier
    }
}
</script>

<style lang="scss" scoped>
.button {
    margin: 0;
    padding: 0;
    outline: none;
    background: transparent;
    border: none;
    cursor: pointer;
}
</style>


