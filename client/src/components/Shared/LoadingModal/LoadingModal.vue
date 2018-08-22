<template>
    <div class="loading-modal">
        <div class="overlay" @click="closeModal"></div>
        <div class="content">
            <div class="loader-content">
                <img :src="logo" alt="">
                <div class="loader">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

            <div class="small-title">Waiting for transaction to be mined</div>

            <cg-button button-style="transparent">Back to gallery</cg-button>
        </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_LOADING_MODAL } from 'store/modal/types';

  import logo from 'assets/cg-logo-no-text.png';

  export default {
    name: 'LoadingModal',
    data: () => ({
      logo,
    }),
    methods: {
      ...mapActions({
        closeModal: TOGGLE_LOADING_MODAL,
      })
    }
  };
</script>

<style lang="scss" scoped>
    .loading-modal {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        max-height: 100vh;
        .overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(217, 217, 217, 0.92);
        }
        .content {
            display: flex;
            align-items: center;
            flex-direction: column;
            z-index: 1;

            .small-title {
                max-width: 190px;
                margin-top: 20px;
                text-align: center;
            }

            .button-wrapper {
                margin-top: 20px;
            }
        }

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

    }
</style>
