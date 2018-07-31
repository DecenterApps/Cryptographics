<template>
    <div>
        <h3 class="large-title">Edit Profile</h3>
        <div class="edit-profile-modal">
            <div class="left">
            <img class="avatar" src="">
            <div class="input-group">
                {{ newUsername }}
                <cg-input :value="newUsername" @input="(val) => newUsername = val" placeholder="Enter username"/>
                <input-file
                    id="avatar-image"
                    button-style="transparent">
                    <span>Profile images must be 1:1 aspect ratio</span>
                </input-file>
            </div>
            </div>
            <div class="right">
                <cg-button
                    type="submit" 
                    @submit.prevent="editUsername()">
                    Submit
                </cg-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { EDIT_USERNAME } from 'store/user-config/types';

export default {
    name: 'EditProfile',
    data: () => ({
        newUsername: ''
    }),
    methods: {
        ...mapActions({
            editUsername: EDIT_USERNAME
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
