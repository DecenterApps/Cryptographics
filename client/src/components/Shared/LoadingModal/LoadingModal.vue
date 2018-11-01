<template>
    <div class="loading-modal">
        <div class="overlay" @click="closeModal"></div>
        <div class="content">
            <loader v-if="!hasError" />
            <ico-error v-if="hasError" />

            <div class="small-title">{{ content }}</div>

            <cg-button @click="closeModal" button-style="secondary" v-if="hasError">
                Ok
            </cg-button>

            <div class="button-group" v-if="!hasError">
                <cg-button @click="dismiss" button-style="secondary">
                    Dismiss
                </cg-button>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { HIDE_LOADING_MODAL, LOADING_CONTENT } from 'store/modal/types';
  import IcoError from '../../Shared/UI/Icons/IcoError';

  export default {
    name: 'LoadingModal',
    data: () => ({}),
    components: { IcoError },
    computed: {
      ...mapGetters({
        content: LOADING_CONTENT,
      }),
      hasError() {
        return this.content.toLowerCase().indexOf('error') >= 0;
      },
    },
    methods: {
      ...mapActions({
        closeModal: HIDE_LOADING_MODAL,
      }),
      backToGallery() {
        this.closeModal();
        this.$router.push('/gallery');
      },
      dismiss() {
        this.closeModal();
      }
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
                max-width: 350px;
                margin-top: 20px;
                text-align: center;
                line-height: 26px;
            }

            button {
                margin-top: 20px;
            }
        }
    }
</style>
