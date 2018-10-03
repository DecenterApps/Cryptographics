<template>
    <span
        :title="`${formatNum(value)}`"
        v-if="value > 0"
        class="price"
        :class="[color, size]">
        {{ formatNum(value) }}
    </span>
    <span
        v-else-if="showIfFree && value >= 0"
        class="price"
        :class="[color, size]">
        {{ value }}
    </span>
</template>

<script>
    import { formatSmallNumber } from 'services/utils';

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
        },
        methods: {
          formatNum(num) { return formatSmallNumber(parseFloat(num)); },
        },
<<<<<<< HEAD
        size: {
            type: String,
            default: 'normal'
        },
        showIfFree: {
            type: Boolean,
            default: false
        }
=======
>>>>>>> cf7487da833e3a64ad091dfc3c54be6753683bea
    }
</script>

<style lang="scss" scoped>
.price {
    font-family: 'Roboto', serif;
    cursor: default;
    vertical-align: top;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;

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
        line-height: 1.5em;
        display: inline-block;
        height: 19px;
    }
    
}
</style>
