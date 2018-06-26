<template>
    <header class="page-header">
        <div class="header-container">
            <div class="logo-section">
                <router-link to="/"><img src="../assets/logo.png" /></router-link>
            </div>
            <div class="links-section">
                <div class="links">
                    <router-link class-active="active" to="/gallery"> Gallery</router-link>
                    <router-link class-active="active" to="/asset_packs">Asset Packs</router-link>
                    <router-link class-active="active" to="/about">About</router-link>
                    <span>|</span>
                </div>
                <div class="profile">
                    <router-link to="/profile">My Profile</router-link>
                    <span class="profile-img"></span>
                    <router-link class="create-button" to="/create">
                        Create
                    </router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
  export default {
    name: 'page-header'
  };
</script>

<style scoped lang="scss">
    .page-header {
        background-color: #000;
        font-family: Roboto, sans-serif;
        font-size: 12px;

        a {
            color: #fff;
            text-decoration: none;
        }

        .header-container {
            width: 1115px;
            margin: 0 auto;
            padding: 15px;
            display: flex;
            justify-content: space-between;
        }

        .links-section {
            display: flex;
            align-items: center;

            .links a {
                font-size: 12px;
                margin-right: 25px;

                &.router-link-active {
                    text-decoration: underline;
                }
            }
        }

        .profile {
            display: flex;
            margin-left: 100px;
            align-items: center;

            .profile-img {
                display: inline-block;
                width: 33px;
                height: 33px;
                background-color: #D8D8D8;
                border-radius: 100%;
                margin: 0 20px 0 10px;
            }

            .create-button {
                background-color: #fff;
                border-radius: 5px;
                outline: 0;
                border: 0;
                height: 33px;
                width: 74px;
                cursor: pointer;
                color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>