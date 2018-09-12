<template>
    <div>
        <h3 class="large-title">Edit Profile</h3>
        <form
                class="edit-profile-modal"
                @submit.prevent="editProfile({ newUsername, newAvatarBytes32 })">
            <div class="left">
                <img
                        class="avatar"
                        v-if="newAvatarBytes32 === ''"
                        :src="ipfsNodePath + avatar">
                <img
                        class="avatar"
                        v-else
                        :src="ipfsNodePath + newAvatarHash">
                <div class="input-group">
                <span
                        class="info fail"
                        v-if="isExistingUsername">
                    Existing username, please try again
                </span>
                    <span
                            class="info success"
                            v-if="isSuccess">
                    You have updated your profile successfully!
                </span>
                    <span
                            class="info"
                            v-if="newUsername.length >= 16">
                    Username can't be longer than 16 characters
                </span>
                    <cg-input
                            v-model="newUsername"
                            placeholder="Enter username" />
                    <input-file
                            id="avatar-image"
                            button-style="secondary"
                            :multiple="false"
                            @change="onFileChanged">
                        <span v-if="newAvatarBytes32 === ''">Profile images must be 1:1 aspect ratio</span>
                        <span v-else>You have selected: {{ imageName.slice(0, 22) }}<span v-if="imageName.length > 22">...</span></span>
                    </input-file>
                </div>
            </div>
            <div class="right">
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
  import * as ipfsService from 'services/ipfsService';
  import * as utils from 'services/utils';
  import { ipfsNodePath } from 'config/constants';

  import { mapActions, mapGetters } from 'vuex';
  import { USERNAME, AVATAR, EDIT_PROFILE, USERNAME_EXISTENCE, EDIT_PROFILE_RESULT } from 'store/user-config/types';

  export default {
    name: 'EditProfile',
    data: () => ({
      ipfsNodePath,
      newUsername: '',
      newAvatarBytes32: '',
      newAvatarHash: '',
      imageName: ''
    }),
    methods: {
      ...mapActions({
        editProfile: EDIT_PROFILE,
      }),
      onFileChanged(event) {
        let selectedImage = event.target.files[0];
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.canvas.width = 160;
        context.canvas.height = 160;
        let url = window.URL || window.webkitURL;
        let profileImg = new Image();
        profileImg.crossOrigin = 'Anonymous';
        profileImg.src = url.createObjectURL(selectedImage);
        profileImg.onload = async () => {
          context.drawImage(profileImg, 0, 0, profileImg.width, profileImg.height, 0, 0, 160, 160);
          let pngUrl = canvas.toDataURL('image/png');
          this.newAvatarHash = await ipfsService.uploadFile(pngUrl.substr(22));
          this.newAvatarBytes32 = utils.getBytes32FromIpfsHash(this.newAvatarHash);
          this.imageName = selectedImage.name;
        };
      }
    },
    computed: {
      ...mapGetters({
        currentUsername: USERNAME,
        isExistingUsername: USERNAME_EXISTENCE,
        isSuccess: EDIT_PROFILE_RESULT,
        avatar: AVATAR
      })
    }
  };
</script>

<style lang="scss" scoped>
    .edit-profile-modal {
        display: flex;
        width: 924px;
        .left {
            flex: 0 0 50%;
            display: inline-flex;
            align-items: flex-end;
            .avatar {
                width: 160px;
                height: 160px;
                background-color: #d9d9d9;
            }
            .input-group {
                display: inline-flex;
                flex-direction: column;
                margin-left: 20px;
                min-width: 290px;
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
