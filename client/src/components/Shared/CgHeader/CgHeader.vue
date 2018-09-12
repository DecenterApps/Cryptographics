<template>
    <div class="header-wrapper">
        <header class="header">
            <div class="header-container container">
                <div class="logo">
                    <router-link to="/">
                        <logo /> <span>Cryptographics</span>
                    </router-link>
                </div>
                <div class="links-section">
                    <div class="links">
                        <router-link to="/gallery" active-class="active">Gallery</router-link>
                        <router-link to="/asset-packs" active-class="active">Asset Packs</router-link>
                        <router-link to="/about" active-class="active">About</router-link>
                    </div>
                    <div class="profile">
                        <router-link class="profile-link" to="/profile">
                            {{ username }}
                            <img
                                    class="avatar"
                                    :src="ipfsNodePath + avatar">
                        </router-link>
                        <button-link to="/create-graphic" button-style="primary">Compose</button-link>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ipfsNodePath } from 'config/constants';
  import { USERNAME, AVATAR } from 'store/user-config/types';

  import Logo from '../UI/Logo.vue';

  export default {
    name: 'CgHeader',
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

    .header-wrapper {
        height: 70px;
    }
    .header {
        position: fixed;
        top: 0;
        width: 100%;
        height: 70px;
        z-index: 4;
        background-color: #000;
        font-family: Roboto, sans-serif;
        font-size: 12px;
        a {
            color: #fff;
            text-decoration: none;
            height: 40px;
            display: inline-block;
            span {
                vertical-align: middle;
                display: inline-block;
                height: 40px;
                font-size: 14px;
                font-weight: bold;
                margin-left: 4px;
                opacity: 0;
                transition: opacity .2s;
            }
            &:hover span {
                opacity: 1;
            }
        }
        .header-container {
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            @media screen and (max-width: 767px) {
                flex-direction: column;
                align-items: center;
                .logo {
                    margin-bottom: 30px;
                }
                .links-section {
                    width: 100%;
                    justify-content: space-between;
                    .profile {
                        margin-left: 0;
                    }
                    @media screen and (max-width: 425px) {
                        flex-direction: column-reverse;
                        & > div {
                            margin-bottom: 30px;
                        }
                    }
                }
            }
        }
        .links-section {
            display: flex;
            align-items: center;
            .links a {
                line-height: 40px;
                font-size: 12px;
                margin-right: 25px;
                transition: opacity .2s;
                &:hover {
                    opacity: .8;
                }
                &:last-of-type {
                    margin-right: 0;
                }
                &.active {
                    text-decoration: underline;
                }
            }
        }
        .profile {
            display: flex;
            margin-left: 100px;
            align-items: center;
            .profile-link {
                display: flex;
                align-items: center;
            }
            .avatar {
                display: inline-block;
                width: 33px;
                height: 33px;
                border-radius: 100%;
                margin: 0 20px 0 10px;
            }
        }
    }
</style>