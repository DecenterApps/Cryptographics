<template>
    <div :class="['loader-content', loaderStyle]">
        <img v-if="loaderStyle === ''" :src="logo" alt="">
        <logo v-if="loaderStyle !== ''" :size="14"></logo>
        <div class="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script>
  import logo from 'assets/cg-logo-no-text.png';
  import Logo from './Logo';

  export default {
    name: 'Loader',
    components: { Logo },
    props: {
      loaderStyle: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      logo,
    }),
  };
</script>

<style lang="scss" scoped>
    .loader-content {
        position: relative;
        height: 100px;
        width: 100px;

        img, svg {
            display: block;
            position: absolute;
            top: 53%;
            left: 50%;
            margin-left: -20px;
            margin-top: -20px;
        }

        img {
            height: 37px;
            width: 40px;
        }
    }

    .loader {
        display: inline-block;
        position: relative;
        width: 100px;
        height: 100px;
    }

    .loader div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 100px;
        height: 100px;
        margin: 1px;
        border: 1px solid #000;
        border-radius: 50%;
        animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #000 transparent transparent transparent;
    }

    .loader div:nth-child(1) {
        animation-delay: -0.45s;
    }

    .loader div:nth-child(2) {
        animation-delay: -0.3s;
    }

    .loader div:nth-child(3) {
        animation-delay: -0.15s;
    }

    @keyframes loader {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .loader-content.white {
        height: 28px;
        width: 28px;

        .loader {
            height: 28px;
            width: 28px;
        }
        .loader div {
            height: 28px;
            width: 28px;
            border: 1px solid #fff;
            border-color: #fff transparent transparent transparent;
            animation-duration: 1.1s;
        }

        img, svg {
            margin-left: -6px;
            margin-top: -6px;
        }
    }

</style>
