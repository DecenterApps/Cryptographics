<template>
    <span class="button-wrapper">
        <button
                class="button"
                :class="buttonStyle"
                :disabled="disabled"
                v-bind="$attrs"
                v-on="$listeners"
        >
            <slot />
        </button>
        <svg class="spinner" v-if="disabled" fill="none" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
            <path d="m42 22c0-11.046-8.9543-20-20-20s-20 8.9543-20 20 8.9543 20 20 20" stroke="#000" stroke-width="2" />
        </svg>
    </span>
</template>

<script>
  export default {
    name: 'Button',
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
    .button-wrapper {
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

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
        &[disabled=disabled], &:disabled {
            background: none;
            cursor: not-allowed;
            border: 1px solid rgba(0, 0, 0, 0.2);
            color: rgba(0, 0, 0, 0.2);
        }
    }

    .spinner {
        width: 20px;
        height: 20px;

        animation: rotate 1s linear infinite;
        margin-left: 15px;
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

    .pagination {
        min-width: auto;
        color: #858585;
        background: none;
        border: 1px solid transparent;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>

