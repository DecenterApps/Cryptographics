<template>
    <div>
        <h3 class="large-title">Edit Profile</h3>
        <form
            class="edit-profile-modal"
            @submit.prevent="changeUsername(newUsername)">
            <div class="left">
            <img class="avatar" src="">
            <div class="input-group">
                <span
                    class="info fail"
                    v-if="isExistingUsername">
                    Existing username, please try again
                </span>
                <span
                    class="info success"
                    v-if="isChanged">
                    You have updated your profile successfully!
                </span>
                <cg-input
                    v-model="newUsername"
                    placeholder="Enter username"/>
                <input-file
                    id="avatar-image"
                    button-style="transparent">
                    <span>Profile images must be 1:1 aspect ratio</span>
                </input-file>
            </div>
            </div>
            <div class="right">
                <cg-button
                    type="submit">
                    Submit
                </cg-button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { CHANGE_USERNAME, USERNAME_EXISTENCE, CHANGE_USERNAME_RESULT } from 'store/user-config/types';

export default {
    name: 'EditProfile',
    data: () => ({
        newUsername: ''
    }),
    methods: {
        ...mapActions({
            changeUsername: CHANGE_USERNAME,
        })
    },
    computed: {
        ...mapGetters({
            isExistingUsername: USERNAME_EXISTENCE,
            isChanged: CHANGE_USERNAME_RESULT
        })
    }
}
</script>

<style lang="scss" scoped>
.edit-profile-modal {
    display: flex;
    .left {
        flex: 0 0 50%;
        display: inline-flex;
        align-items: flex-end;
        .avatar {
            width: 160px;
            height: 160px;
            display: inline-flex;
            background-color: #d9d9d9;
        }
        .input-group {
            display: inline-flex;
            flex-direction: column;
            margin-left: 20px;
            .info {
                margin-bottom: 10px;
                font-size: 12px;
                &.fail {
                    color: #d82d2d;
                }
                &.success {
                    color: #000;
                    font-weight: bold;
                }
            }
        }
    }
    .right {
        flex: 0 0 50%;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
    }
}    
</style>
