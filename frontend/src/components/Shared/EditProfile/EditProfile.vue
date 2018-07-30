<template>
    <div>
        <h3 class="large-title">Edit Profile</h3>
        <div class="edit-profile-modal">
            <div class="left">
            <img class="avatar" src="">
            <div class="input-group">
                <cg-input placeholder="Enter username"/>
                <input-file
                    id="avatar-image"
                    button-style="transparent">
                    <span>Profile images must be 1:1 aspect ratio</span>
                </input-file>
            </div>
            </div>
            <div class="right">
                <cg-button>
                    Submit
                </cg-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'EditProfile'
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
