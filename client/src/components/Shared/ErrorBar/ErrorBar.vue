<template>
    <div class="error-bar">
        <div class="container">
            <div class="error-content">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ipfsNodePath } from 'config/constants';
  import { USERNAME, AVATAR } from 'store/user-config/types';

  import Logo from '../UI/Logo.vue';

  export default {
    name: 'ErrorBar',
    props: {
      error: {
        type: String,
        default: '',
      },
    },
    components: {
      Logo
    },
    data() {
      return {
        ipfsNodePath,
      };
    },
    computed: {
      ...mapGetters({
        username: USERNAME,
        avatar: AVATAR
      })
    }
  };
</script>

<style scoped lang="scss">
    .error-bar {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background-color: rgba(255, 146, 163, 0.7);
        height: 65px;

        .error-content {
            height: 65px;
            display: flex;
            align-items: center;
            color: #fff;
            font-family: Roboto, sans-serif;
            font-size: 12px;
        }
    }
</style>