<template>
    <div class="modal">
        <div class="overlay"></div>
        <div class="content">
            <button-icon
                icon-type="close"
                @click="closeModal"/>
            <edit-profile v-if="content === 'editProfile'"/>
            <div v-else>
                <slot/>
            </div>
        </div>
    </div>    
</template>

<script>
import { mapActions } from 'vuex';
import { TOGGLE_MODAL } from 'store/modal/types';

import EditProfile from 'shared/EditProfile/EditProfile.vue';

export default {
    name: 'Modal',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    components: {
        EditProfile
    },
    methods: {
        ...mapActions({
            closeModal: TOGGLE_MODAL
        })
    }
}
</script>

<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 100vh;
    .overlay {
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        background-color: fade-out(#000, .3);
    }
    .content {
        position: relative;
        width: 100%;
        max-width: 1120px;
        padding: 90px;
        background-color: #C4C4C4;
        .ico-button {
            position: absolute;
            top: 20px;
            right: 20px;
        }
    }
}
</style>
