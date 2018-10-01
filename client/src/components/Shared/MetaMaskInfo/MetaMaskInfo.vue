<template>
    <div class="meta-mask-info">
        <ico-error />

        <div class="text-wrapper">
            You don’t have <span>MetaMask</span> enabled. Without MetaMask, you cannot buy Asset Packs, claim
            ownership of the Cryptographics you create, or trade them. Please enable MetaMask or check if you
            are logged in.
        </div>

        <h3>What is MetaMask?</h3>

        <div>
            <div class="text-wrapper secondary">
                MetaMask is a Web3.0 enabling extension that acts as a bridge between your browser and the Ethereum
                blockchain. It manages your Ethereum account which keeps your Ether funds and unique Cryptographics
                tokens.
            </div>

            <a
                target="_blank"
                class="button secondary"
                rel="noopener noreferrer"
                href="https://metamask.io/">
                Get MetaMask
            </a>
            <p>Or if you need help <a target="_blank" href="https://discordapp.com/invite/xnhfYRS">get in touch</a> with us.</p>
            
        </div>

        <img class="round-logo" :src="roundLogo" alt="">
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL } from 'store/modal/types';
  import roundLogo from 'assets/round-logo.png';
  import IcoError from '../../Shared/UI/Icons/IcoError';

  export default {
    name: 'MetaMaskInfo',
    components: { IcoError },
    data: () => ({
      showMoreInfo: false,
      roundLogo,
    }),
    methods: {
      ...mapActions({
        openModal: TOGGLE_MODAL,
      }),
    },
  };
</script>

<style scoped lang="scss">
    @import "../UI/button-styles";
    .meta-mask-info {
        text-align: center;
        .button {
            margin-bottom: 15px;
        }
        svg {
            display: block;
            margin: auto;
            margin-bottom: 27px;
        }

        h3 {
            text-align: center;
            cursor: pointer;
            margin: 30px auto 0 auto;
            font-size: 20px;
            font-family: 'YoungSerif-Regular', serif;
            transition: opacity .2s ease-in-out;

            a {
                color: black;
                text-decoration: none;
            }

            &.link {

            }

            &:hover {
                opacity: 0.6;
            }
        }

        .text-wrapper {
            text-align: center;
            line-height: 24px;
            font-size: 14px;
            max-width: 390px;

            span {
                font-weight: bold;
                margin: 0 3px;
            }

            &.secondary {
                margin: 30px 0;
            }
        }

        .round-logo {
            position: absolute;
            bottom: -28px;
            height: 56px;
            width: 56px;
            left: 50%;
            margin-left: -28px;
        }
    }
</style>