<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="logo">
                <img src="../../assets/logo.png" alt="">
            </div>
            <div class="links-section">
                <router-link to="/gallery"> Gallery</router-link>
                <router-link to="/asset_packs">Asset Packs</router-link>
                <router-link to="/about">About</router-link>
            </div>
            <div class="social">

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
            width: 1120px;
            margin: 0 auto;
            padding: 15px 0;
            display: flex;
            justify-content: space-between;

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
        }
    }
</style>