<template>
    <div class="set-username">
        <h3 class="large-title">Enter artist name</h3>
        <p class="description">In order to claim your token, you need to set your name first!</p>
        <form
                class="edit-profile-modal"
                @submit.prevent="setUsername(newUsername)"
        >
                <span
                        class="info fail"
                        v-if="isExistingUsername">
                    Existing username, please try again
                </span>
            <span
                    class="info success"
                    v-if="isSuccess">
                    You have updated your username successfully!
                </span>
            <span
                    class="info"
                    v-if="newUsername.length >= 20">
                    Username can't be longer than 16 characters
                </span>
            <div class="input-group">
                <cg-input
                        v-model="newUsername"
                        placeholder="Your name" />

                <cg-button
                        type="submit"
                        :disabled="newUsername.length >= 16">
                    Submit
                </cg-button>
            </div>
        </form>
    </div>
</template>

<script>
  import { ipfsNodePath } from 'config/constants';

  import { mapActions, mapGetters } from 'vuex';
  import { USERNAME, AVATAR, SET_NEW_USERNAME, USERNAME_EXISTENCE, EDIT_PROFILE_RESULT } from 'store/user-config/types';

  export default {
    name: 'SetUsername',
    data: () => ({
      ipfsNodePath,
      newUsername: '',
    }),
    methods: {
      ...mapActions({
        setUsername: SET_NEW_USERNAME,
      }),
    },
    computed: {
      ...mapGetters({
        currentUsername: USERNAME,
        isExistingUsername: USERNAME_EXISTENCE,
        isSuccess: EDIT_PROFILE_RESULT,
      })
    }
  };
</script>

<style lang="scss" scoped>
    .set-username {
        width: 286px;

        .large-title {
            margin-bottom: 20px;
        }

        .description {
            font-family: Roboto, sans-serif;
            font-size: 12px;
            color: #949494;
        }

        .input {
            width: 100%;
            flex: 1;
            margin-right: 10px;
        }

        .button {
            min-width: 86px;
        }

        .info {
            margin-bottom: 10px;
            font-size: 12px;
            color: #949494;
            &.fail {
                color: #d82d2d;
            }
            &.success {
                color: #000;
                font-weight: bold;
            }
        }

        .input-group {
            display: flex;
        }
    }
</style>
