<template>
    <div class="header-wrapper">
        <header class="header">
            <div class="header-container container">
                <div class="logo">
                    <router-link to="/">
                        <logo /> <span>Cryptographics</span>
                    </router-link>
                </div>
                <div class="mobile-menu-toggle" @click="showMenu = !showMenu"></div>
                <div
                    class="links-section"
                    :class="{'show-menu' : showMenu }">
                    <div class="links">
                        <router-link to="/gallery" active-class="active" @click.native="closeMenu">Gallery</router-link>
                        <router-link to="/asset-packs" active-class="active" @click.native="closeMenu">Asset Packs</router-link>
                        <router-link to="/about" active-class="active" @click.native="closeMenu">About</router-link>
                        <router-link to="/faq" active-class="active" @click.native="closeMenu">FAQ</router-link>
                    </div>
                    <div class="profile">
                        <router-link class="profile-link" to="/profile" @click.native="closeMenu">
                            {{ username }}
                            <img
                                class="avatar"
                                :src="avatar">
                        </router-link>
                        <button-link
                            to="/create-cryptographic"
                            button-style="secondary inverted"
                            @click.native="closeMenu">
                            Compose
                        </button-link>
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
        showMenu: false
      };
    },
    watch: {
        showMenu: function (val) {
            const html = document.querySelector('html');
            val ? html.classList.add('no-scroll') : html.classList.remove('no-scroll') 
        }
    },
    computed: {
      ...mapGetters({
        username: USERNAME,
        avatar: AVATAR
      })
    },
    methods: {
        closeMenu() {
            this.showMenu = false
        }
    }
  };
</script>

<style scoped lang="scss">

    .header-wrapper {
        height: 70px;
        z-index: 999;
        position: relative;
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
                transition: opacity .2s;
                opacity: 0;
                @media screen and (max-width: 768px) {
                    opacity: 1;
                }
            }
            &:hover span {
                opacity: 1;
            }
        }
        .header-container {
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            position: relative;
            .mobile-menu-toggle {
                display: none;
            }
            @media screen and (max-width: 768px) {
                margin: 0;
                align-items: center;
                .logo {
                    padding: 0 25px;
                }
                .mobile-menu-toggle {
                    cursor: pointer;
                    display: inline-flex;
                    padding: 10px;
                    margin: 0 15px;
                    &:after {
                        content: "\2630";
                        font-family: Roboto, sans-serif;
                        font-size: 22px;
                        color: #fff;
                    }
                }
                .links-section {
                    width: 100%;
                    .profile {
                        margin-left: 0;
                    }
                }
            }
        }
        .links-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
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
            @media screen and (max-width: 768px) {
                font-size: 14px;
                font-weight: 100;
                background-color: #000;
                position: fixed;
                top: 70px;
                left: -100%;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column-reverse;
                justify-content: flex-end;
                transition: all .2s ease;
                &.show-menu {
                    left: 0;
                }
                .profile {
                    margin: 30px 0 50px;
                    padding: 0 25px;
                    width: 100%;
                    align-items: center;
                    justify-content: space-between;
                    font-size: inherit;
                    font-weight: inherit;
                    .button {
                        font-size: inherit;
                        font-weight: inherit;
                    }
                    .avatar {
                        margin-right: 0;
                    }
                }
                .links {
                    flex-direction: column;
                    display: flex;
                    text-align: center;
                    a {
                        margin-right: 0;
                        font-size: inherit;
                        font-weight: inherit;
                        margin-bottom: 20px;
                    }
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