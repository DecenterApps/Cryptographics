<template>
    <div class="loading-modal">
        <div class="overlay" @click="closeModal"></div>
        <div class="content">
            <loader />
            <div class="small-title">Waiting for transaction to be mined</div>
            <cg-button button-style="transparent">Back to gallery</cg-button>
        </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_LOADING_MODAL } from 'store/modal/types';

  export default {
    name: 'LoadingModal',
    data: () => ({
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
    }
</style>
