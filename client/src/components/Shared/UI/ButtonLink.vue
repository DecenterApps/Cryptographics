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
            default: 'negative'
        },
        to: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped lang="scss">
.button {
    display: inline-flex;
    justify-content: center;
    min-width: 105px;
    max-height: 33px;
    min-height: 33px;
    padding: 9px;
    font-size: 12px;
    border-radius: 5px;
    cursor: pointer;
    outline: 0;
    text-decoration: none;
    text-align: center;
    text-transform: capitalize;
    white-space: nowrap;
    line-height: 1;
}
.positive {
    color: #000;
    background-color: #fff;
    border: 1px solid #fff;
}
.negative {
    color: #fff;
    background-color: #000;
    border: 1px solid #000;
}
.transparent {
    color: #000;
    background: none;
    border: 1px solid #000;
}
.no-border {
    color: #000;
    background: none;
    border: 1px solid transparent;
}
</style>

