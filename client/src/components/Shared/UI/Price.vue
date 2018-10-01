<template>
    <span
        v-if="value > 0"
        class="price"
        :class="[color, size]">
        {{ value }}
    </span>
</template>

<script>
export default {
    name: 'Price',
    props: {
        value: {
            type: String,
            default: '0.00'
        },
        color: {
            type: String,
            default: 'black'
        },
        size: {
            type: String,
            default: 'normal'
        }
    }
}
</script>

<style lang="scss" scoped>
.price {
    font-family: 'Roboto', serif;
    cursor: default;
    vertical-align: top;
    &.white {
        color: #fff;
    }
    &.black {
        color: #000;
    }
    &.normal {
        font-size: 32px;
    }
    &.small {
        font-size: 21px;
    }
    &.medium {
        font-size: 25px;
    }
    &.inherit {
        font-size: inherit;
    }
    &:before {
        content: "\039E";
        font-family: Roboto, sans-serif;
        font-size: .6em;
        position: relative;
        vertical-align: middle;
        height: 1em;
        line-height: 1.5em;
        display: inline-block;
    }
    
}
</style>
