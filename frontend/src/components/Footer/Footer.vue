<template>
    <footer class="footer">
        <div class="container footer-container">
            <div class="logo">
                <img src="../../assets/logo.png" alt=""> Cryptographics
            </div>
            <div class="links-section">
                <router-link to="/gallery"> Gallery</router-link>
                <router-link to="/asset_packs">Asset Packs</router-link>
                <router-link to="/about">About</router-link>
            </div>
            <div class="social">
                <img src="./assets/facebook.png" alt="">
                <img src="./assets/instagram.png" alt="">
                <img src="./assets/twitter.png" alt="">
                <img src="./assets/youtube.png" alt="">
            </div>
        </div>
    </footer>
</template>

<script>
  export default {
    name: 'page-footer'
  };
</script>

<style scoped lang="scss">
    .footer {
        background-color: #000;
        height: 210px;
        display: flex;
        align-items: center;
        font-size: 12px;

        a {
            color: #fff;
            text-decoration: none;
        }


        .footer-container {
            padding: 15px 0;
            display: flex;
            justify-content: space-between;

            .logo {
                display: flex;
                align-items: center;
                color: #fff;
                font-size: 15px;
                img {
                    margin-right: 15px;
                }
            }

            .links-section {
                display: flex;
                align-items: center;

                a {
                    font-size: 12px;
                    margin-right: 25px;

                    &.router-link-active {
                        text-decoration: underline;
                    }
                }
            }

            .social {
                display: flex;
                align-items: center;
                img {
                    margin-right: 20px;
                }
            }
        }
    }
</style>