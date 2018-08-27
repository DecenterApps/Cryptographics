<template>
    <div class="loader-content">
        <img :src="logo" alt="">
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

  export default {
    name: 'Loader',
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

        img {
            height: 40px;
            width: 40px;
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -20px;
            margin-top: -20px;
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

</style>
