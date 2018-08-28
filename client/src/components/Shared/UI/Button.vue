<template>
        <button
                class="button"
                :class="buttonStyle"
                :disabled="disabled"
                v-bind="$attrs"
                v-on="$listeners"
        >
            <button-loader v-if="disabled" />
            <slot v-if="!disabled" />
        </button>
</template>

<script>
  import ButtonLoader from './ButtonLoader';
  export default {
    name: 'Button',
    components: { ButtonLoader },
    props: {
      buttonStyle: {
        type: String,
        default: 'negative'
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    }
  };
</script>

<style scoped lang="scss">
    .button {
        position: relative;
        display: inline-flex;
        justify-content: center;
        min-width: 105px;
        height: 33px;
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
        &[disabled=disabled], &:disabled {
            padding: 0;
            background: #AEAEAE;
            cursor: not-allowed;
            border: none;
            color: rgba(0, 0, 0, 0.2);
        }
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

    .transparent-inverted {
        color: #fff;
        background: none;
        border: 1px solid #fff;
    }

    .tab-active {
        color: #000;
        font-weight: bold;
        background: none;
        border: none;
        font-size: 15px;
        text-decoration: underline;
        padding: 0;
    }

    .tab-inactive {
        color: #000;
        background: none;
        border: none;
        font-size: 15px;
        padding: 0;
    }

    .no-border {
        color: #000;
        background: none;
        border: 1px solid transparent;
    }

    .pagination {
        min-width: auto;
        color: #858585;
        background: none;
        border: 1px solid transparent;
    }
</style>

