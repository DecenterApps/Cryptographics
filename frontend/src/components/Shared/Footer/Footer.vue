<template>
    <footer class="footer">
        <div class="container footer-container">
            <router-link to="/" class="logo">
                <img src="./assets/logo.png" alt="Cryptographics"> 
                <div><strong>Cryptographics</strong><span>copyright 2018.</span></div>
            </router-link>
            <div class="links-section">
                <router-link to="/gallery" class-active="active">Gallery</router-link>
                <router-link to="/asset-packs" class-active="active">Asset Packs</router-link>
                <router-link to="/about" class-active="active">About</router-link>
            </div>
            <div class="social">
                <a
                    v-for="(item, index) in social"
                    :href="item.url"
                    :key="index"
                    target="_blank">
                    <img :src="item.img" :alt="item.name">
                </a>
            </div>
        </div>
    </footer>
</template>

<script>
  export default {
    name: 'Footer',
    data: () => ({
        social: [
            {   name: 'facebook',
                img: require('./assets/facebook.png'),
                url: 'https://www.facebook.com' },
            {   name: 'instagram',
                img: require('./assets/instagram.png'),
                url: 'https://www.facebook.com' },
            {   name: 'twitter',
                img: require('./assets/twitter.png'), 
                url: 'https://www.facebook.com' },
            {   name: 'youtube',
                img: require('./assets/youtube.png'), 
                url: 'https://www.facebook.com' }
        ]
    })
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
            @media screen and (max-width: 767px) {
                flex-direction: column;
                padding: 30px 0;
                align-items: center;
                height: 100%;
            }
            .logo {
                display: flex;
                align-items: center;
                color: #fff;
                font-size: 15px;
                font-family: Roboto, sans-serif;
                img {
                    margin-right: 15px;
                }
                div {
                    font-family: inherit;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: flex-end;
                    strong {
                        font-weight: bold;
                        font-size: 15px;
                        margin-bottom: 2px;
                    }
                    span {
                        font-size: 10px;
                    }
                }
            }
            .links-section {
                display: flex;
                align-items: center;
                a {
                    font-size: 12px;
                    margin-right: 25px;
                    &:last-of-type {
                        margin-right: 0;
                    }
                    &.active {
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