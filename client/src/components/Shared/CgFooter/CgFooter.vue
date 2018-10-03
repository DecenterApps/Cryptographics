<template>
    <footer class="footer">
        <div class="container footer-container">
            <router-link tag="div" to="/" class="logo">
                <logo />
                <div><strong>Cryptographics</strong><span>copyright 2018.</span></div>
            </router-link>
            <div class="links-section">
                <router-link to="/gallery" active-class="active">Gallery</router-link>
                <router-link to="/asset-packs" active-class="active">Asset Packs</router-link>
                <router-link to="/about" active-class="active">About</router-link>
                <router-link to="/faq" active-class="active">FAQ</router-link>
            </div>
            <div class="social">
                <ico-social
                    v-for="(item, index) in social"
                    :href="item.url"
                    :social-media="item.name"
                    :key="index" />
            </div>
            <a href="https://www.decenter.com/" target="_blank" class="decenter-logo">
                <p>Developed by</p>
                <logo-decenter />
            </a>
        </div>
    </footer>
</template>

<script>
  import Logo from '../UI/Logo.vue';
  import LogoDecenter from '../UI/LogoDecenter.vue';
  import IcoSocial from './IcoSocial.vue';

  export default {
    name: 'CgFooter',
    components: {
      Logo,
      LogoDecenter,
      IcoSocial
    },
    data: () => ({
      social: [
        { name: 'reddit', url: 'https://www.reddit.com/r/Cryptographics/' },
        { name: 'discord', url: 'https://discord.gg/xnhfYRS' },
        { name: 'twitter', url: 'https://twitter.com/_Cryptographics' }
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
            flex-wrap: wrap;
            & div {
                flex: 0 0 33%;
            }
            & > a {
                flex: 1 0 100%;
            }
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
                margin-bottom: 15px;
                svg {
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
            .decenter-logo {
                margin-top: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                p {
                    font-size: 9px;
                    color: #fff;
                    margin-bottom: 3px;
                }
            }
            .links-section {
                display: flex;
                align-items: center;
                justify-content: center;
                a {
                    font-size: 12px;
                    margin-right: 25px;
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
            .social {
                display: flex;
                align-items: center;
                justify-content: center;
                a {
                    margin-right: 20px;
                }
            }
        }
    }
</style>