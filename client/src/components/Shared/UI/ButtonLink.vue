<template>
    <router-link 
        class="button"
        tag="button"
        :to="to"
        :class="buttonStyle"
        v-bind="$attrs"
        v-on="$listeners">
        <slot/>
    </router-link>
</template>

<script>
export default {
    name: 'ButtonLink',
    props: {
        buttonStyle: {
            type: String,
            default: 'primary'
        },
        to: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped lang="scss">
    @import "./button-styles";
</style>

F