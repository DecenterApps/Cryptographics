<template>
    <button 
        class="button"
        v-bind="$attrs"
        v-on="$listeners">
        <img v-if="iconType === 'download'" src="./icons/ico-download.png">
        <img v-if="iconType === 'zoom'"  src="./icons/ico-magnifier.png">
    </button>
</template>

<script>
export default {
    name: 'ButtonIcon',
    props: {
        iconType: {
            type: String,
            default: 'download'
        }
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


