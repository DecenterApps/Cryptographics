<template>
    <div class="modal">
        <div class="overlay" @click="closeModal"></div>
        <div :class="['content', smallerPadding(content)]">
            <button-icon
                    icon-type="close"
                    @click="closeModal" />
            <edit-profile v-if="content === 'editProfile'" />
            <set-username v-if="content === 'setUsername'" />
            <success-message v-if="content ==='Cryptographic' || content === 'Asset pack'" :content="content" />
            <div v-else>
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';

  import EditProfile from 'shared/EditProfile/EditProfile.vue';
  import SetUsername from 'shared/SetUsername/SetUsername.vue';
  import SuccessMessage from 'shared/SuccessMessage/SuccessMessage.vue';

  export default {
    name: 'Modal',
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    components: {
      SuccessMessage,
      SetUsername,
      EditProfile
    },
    methods: {
      ...mapActions({
        closeModal: TOGGLE_MODAL
      }),
      smallerPadding(content) {
        return ['Cryptographic', 'Asset pack'].indexOf(content) >= 0 ? 'small-padding' : 0;
      }
    }
  };
</script>

<style lang="scss" scoped>
    .modal {
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
            background-color: fade-out(#000, .3);
        }
        .content {
            position: relative;
            max-width: 1120px;
            padding: 90px;
            background-color: #C4C4C4;

            &.small-padding {
                padding: 45px;
            }

            .ico-button {
                position: absolute;
                top: 20px;
                right: 20px;
            }
        }
    }
</style>
