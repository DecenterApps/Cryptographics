<template>
    <div>
        <div class="container">
            <div class="logo-container"><logo fill="#333" :size="200" /></div>

            <h1 class="large-title">About Cryptographics</h1>

            <p class="about-text">
                Cryptographics is a fully decentralized visual platform that allows users to create, store and trade unique randomly generated digital artwork on the blockchain.
            </p>
            <p class="about-text">
                Artists, illustrators, photographers or other graphic designers, can create and upload their asset packs, making them available for Creators to buy and use.
            </p>
            <p class="about-text">
                Creators buy asset packs and use them to generate unique random digital artworks called Cryptographics and claim ownership by storing them on the blockchain as unique ERC721 tokens in order to keep or sell them.
            </p>
            <p class="about-text">
                Collectors can purchase and collect Cryptographics, either to create a collection of their own, or to trade them as unique digital collectibles on the marketplace.
            </p>
            <p class="about-text">
                Cryptographics is powered by the Ethereum blockchain and each Cryptographic is stored as a unique ERC721 token.
            </p>
            <p class="about-text">
                Made with passion by <a href="https://decenter.com" target="_blank" rel="noopener">Decenter</a>.
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