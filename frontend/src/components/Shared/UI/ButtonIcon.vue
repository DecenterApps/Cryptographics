<template>
    <button 
        class="button"
        v-bind="$attrs"
        v-on="$listeners">
        <ico-download v-if="iconType === 'download'"/>
        <ico-magnifier v-if="iconType === 'zoom'"/>
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


