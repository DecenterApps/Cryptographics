<template>
    <div>
        <div class="container">
            <div class="logo-container"><logo fill="#333" :size="200" /></div>

            <h1 class="large-title">About Cryptographics</h1>

            <p class="about-text">
                Cryptographics is a fully decentralized digital art creation platform that allows users to create, store and trade unique randomly generated digital artwork on the blockchain. It is a place where Artists, Creators and Collectors come together to create graphical assets, generate Cryptographics and collect or trade them.
            </p>
            <p class="about-text">
                Artists are visual artists, illustrators, photographers or graphic designers, who create graphical assets and upload them as Asset packs that can then be used to generate Cryptographics.
            </p>
            <p class="about-text">
                Creators are authors of Cryptographics and they select, buy and use Asset packs to generate unique randomly generated digital artwork (Cryptographics) and claim ownership by storing them on the blockchain as unique ERC-721 tokens in order to keep or sell them.
            </p>
            <p class="about-text">
                Collectors can purchase and collect Cryptographics, either to create a unique collection of their own, or to trade them as unique digital collectibles on the Gallery marketplace.
            </p>
            <p class="about-text">
                Cryptographics DApp is powered by the Ethereum blockchain and made with love for digital art and passion for decentralization by
                <a href="https://decenter.com" target="_blank" rel="noopener">Decenter</a>.
            </p>

            <h1 class="large-title terms">Terms</h1>

            <p class="about-text">
                Cryptographics is a DApp, a fully decentralized app, and as such it cannot be censored. We do, however, retain the right to hide from the Cryptographics frontend (website) any Asset packs or Cryptographics created with malicious intentions or breaking any copyright laws.
            </p>
        </div>
    </div>
</template>

<script>
  import Logo from '../../Shared/UI/Logo.vue'

  export default {
    name: 'About',
    components: {
      Logo,
    }
  };
</script>

<style scoped lang="scss">
    .container {
        padding: 60px 0;
    }

    .large-title {
        margin: 0 0 30px;

        &.terms {
            margin: 30px 0;
        }
    }

    .about-text {
        line-height: 22px;
        margin-bottom: 15px;
        font-size: 14px;
        max-width: 600px;

        a {
            font-weight: bold;
            text-decoration: underline;
            margin-left: 2px;
            transition: opacity .2s ease-in-out;

            &:hover {
                opacity: 0.7;
            }
        }
    }

    .logo-container {
        float: right;
    }
</style>