<template>
    <div>
        <span class="text-for-width"><slot /></span>
        <div class="button-loader" :class="buttonStyle">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'ButtonLoader',
    props: {
      buttonStyle: {
        type: String,
        default: 'primary'
      },
    }
  };
</script>

<style scoped lang="scss">
    .button-loader {
        position: absolute;
        width: 28px;
        height: 32px;
        left: 0;
        right: 0;
        margin: auto;
        top: 0;
    }
    .button-loader div {
        position: absolute;
        top: 14px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: white;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .button-loader.secondary div,
    .button-loader.tertiary div {
        background: black;
    }
    .button-loader.inverted.secondary div,
    .button-loader.inverted.tertiary div {
        background: white;
    }
    .button-loader div:nth-child(1) {
        left: 3px;
        animation: button-loader1 0.6s infinite;
    }
    .button-loader div:nth-child(2) {
        left: 3px;
        animation: button-loader2 0.6s infinite;
    }
    .button-loader div:nth-child(3) {
        left: 13px;
        animation: button-loader2 0.6s infinite;
    }
    .button-loader div:nth-child(4) {
        left: 22px;
        animation: button-loader3 0.6s infinite;
    }
    @keyframes button-loader1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes button-loader3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }
    @keyframes button-loader2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(9px, 0);
        }
    }
    .text-for-width {
        opacity: 0;
        pointer-events: none;
    }

</style>

