<template>
    <div>
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
        default: 'negative'
      },
    }
  };
</script>

<style scoped lang="scss">
    .button-loader {
        display: inline-block;
        position: relative;
        width: 32px;
        height: 32px;
    }
    .button-loader div {
        position: absolute;
        top: 14px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #d9d9d9;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .button-loader.transparent div {
        background: black;
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

</style>

