<template>
    <span
        :title="value"
        v-if="value > 0"
        class="price"
        :class="[color, size]"
    >{{ formatNum(value) }}</span>
    <span
        v-else-if="showIfFree && parseInt(value, 10) === 0"
        class="price"
        :class="[color, size]"
    >{{ value }}</span>
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
            },
            showIfFree: {
                type: Boolean,
                default: false
            }
        },
        methods: {
          formatNum(num) { return formatSmallNumber(parseFloat(num)); },
        }
    }
</script>

<style lang="scss" scoped>
.price {
    font-family: 'Roboto', serif;
    cursor: default;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
    vertical-align: middle;

    &.white {
        color: #fff;
    }
    &.black {
        color: #000;
    }
    &.normal {
        font-size: 32px;
        line-height: 32px;
    }
    &.small {
        font-size: 21px;
        line-height: 21px;
    }
    &.medium {
        font-size: 25px;
        line-height: 25px;
    }
    &.inherit {
        font-size: inherit;
    }
    &:before {
        content: "\039E";
        font-family: Roboto, sans-serif;
        font-size: .6em;
        position: relative;
        margin-right: 5px;
        vertical-align: bottom;
        line-height: 1.5em;
        display: inline-block;
    }
    
}
</style>
