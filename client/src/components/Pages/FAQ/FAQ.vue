<template>
    <div class="faq-wrapper container">
        <h2>Frequently Asked Questions</h2>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(0)">
                <span class="question">What is a Cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[0].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[0].open }">
                A Cryptographic is a unique piece of digital artwork randomly created by the Cryptographic DApp and
                stored to the blockchain by its Creator. Cryptographics are stored to the Ethereum blockchain as one of
                a kind ERC-721 tokens and they can as such be kept in their owners’ MetaMask accounts or other Ethereum
                wallets and traded with other users.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(1)">
                <span class="question">How do I create a Cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[1].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[1].open }">
                <div>
                    Creating a Cryptographic is a simple 3-step process. Once you
                    click the <router-link to="/create-cryptographic">Compose</router-link>
                    button the steps are as follows:
                </div>
                <ol>
                    <li>
                        <span>Select Asset Packs</span> where you simply pick the Asset packs whose elements you
                        want to see included in your Cryptographic.
                    </li>
                    <li>
                        <span>Generate Cryptographic</span> where the Cryptographic DApp generates digital
                        artwork with random assets from the selected Asset packs using a provably random algorithm.
                        You, as the Creator, are free to try and Recompose the Cryptographic as many times as you want
                        before deciding to save it. You can also choose to use a square format canvas instead or add a
                        white frame to your Cryptographic.
                    </li>
                    <li>
                        <span>Save Cryptographic</span> where you name and describe your Cryptographic, both in 20
                        characters or less, before clicking the Claim Cryptographic button. This process will store your
                        Cryptographic to the blockchain and add the unique ERC-721 token to your MetaMask Ethereum
                        account.
                    </li>
                </ol>
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(2)">
                <span class="question">How do I sell a Cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[2].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[2].open }">
                Once you create and save a Cryptographic to the blockchain, you can offer it for sale in the
                <router-link to="/gallery">Cryptographics Gallery</router-link> at any point in time. You do this by
                selecting the Cryptographic you want to sell in your
                <router-link to="/profile">profile page</router-link>, clicking the List for sale button
                and setting your desired price. Once you’re done, your Cryptographic will be shown with the price you
                set in the Gallery and other users will be able to buy it from you.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(3)">
                <span class="question">What is an Asset pack?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[3].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[3].open }">
                Once you create and save a Cryptographic to the blockchain, you can offer it for sale in the
                An Asset pack is a collection of graphic assets bundled together and uploaded to the Cryptographics
                DApp by an Artist. Every Asset pack has a unique price set by the Artist for the whole pack. A Creator
                only needs to purchase a certain Asset pack once and can reuse it for any number of cryptographics
                afterwards without any additional cost. An Asset pack is always sold and bought as a whole, no matter
                the number of actual assets that were used on a cryptographic.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(4)">
                <span class="question">How do I create an asset pack?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[4].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[4].open }">
                <div>
                    Creating an asset pack is a relatively simple process once you have the actual assets ready for
                    upload. Once you click the <router-link to="/create-asset-pack">Create Asset Pack</router-link>
                    button, these are the three steps you should follow:
                </div>
                <ol>
                    <li>
                        <span>Upload Assets</span> - where you upload the actual graphic files. Please note that
                        the maximum number of assets in an Asset pack is 50. This is also the step where you configure
                        your assets. The options that you can turn on for any of your Assets are Asset scaling, Asset
                        rotation and Background use. An important thing to note is that Asset scaling only works in one
                        direction, reducing the asset size, in order to preserve graphics quality and avoid pixelation.
                    </li>
                    <li>
                        <span>Submit Asset Pack</span>  - where you can see how your Asset pack behaves in the
                        Cryptographics composer and if it works as you intended it to.
                    </li>
                    <li>
                        <span>Save Cryptographic</span> where you need to generate a thumbnail for your Asset pack,
                        name it, put in your desired price and provide an additional description if you want to.
                        Once you click the Submit button, you.
                    </li>
                </ol>
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(5)">
                <span class="question">What can I upload as assets?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[5].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[5].open }">
                You can upload any graphic elements as assets, be it digital art, photography, paintings or drawings.
                In case the graphics you are uploading are not specifically created by you, they should belong to the
                public domain, i.e. not be copyrighted. The content of the graphics itself should not be malicious or
                harmful in any way.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(6)">
                <span class="question">How do I sell an Asset Pack?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[6].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[6].open }">
                There are no additional actions needed to sell an asset pack once you initially submit it to the
                Cryptographics DApp. It will be available in the Asset Packs collection and Creators will be able to
                find and select your Asset Pack during the Cryptographics creation process and each time a new Creator
                uses your Asset Pack you will receive a payment from them in the value you set as the Asset Pack price.
                You can check your funds balance on your profile page at any point in time. Please note that once a
                Creator purchases your Asset Pack, they can reuse it for any number of Cryptographics in the future
                without any additional payments, so please plan and set your Asset Packs' prices accordingly.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(7)">
                <span class="question">What is MetaMask and why do I need it?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[7].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[7].open }">
                MetaMask is a Web3.0 enabling extension for your browser that interacts with the Ethereum blockchain
                and allows you to run Ethereum DApps right in your browser. Please make sure to keep your MetaMask
                account safe and not lose your passwords, since losing access to your account would consequently mean
                losing your Cryptographics or potentially even your Ether funds. MetaMask is available for all current
                major browsers, including Chrome, Firefox, Opera and Vivaldi and you should always get MetaMask from
                <a target="_blank" rel="noopener noreferrer" href="https://metamask.io/">the official website.</a>
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(8)">
                <span class="question">How can I buy a Cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[8].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[8].open }">
                Buying a Cryptographic is as simple as finding a Cryptographic that you like and clicking the Buy
                button once you open its page. However, not all Cryptographics will always be on sale, as Creators and
                Collectors can choose to keep them for themselves after creating or buying them.
            </div>
        </div>
    </div>
</template>

<script>
  const items = [];
  for (let i = 1; i <= 10; i++) items.push({ id: i, open: false })

  export default {
    name: 'FAQ',
    data: () => ({ items }),
    methods: {
      myFilter(id) {
        if (this.items[id].open) {
          this.items[id].open = false;
          return;
        }

        this.items = this.items.map(item => {
          item.open = false;
          return item;
        });

        this.items[id].open = !this.items[id].open;
      }
    }
  };
</script>

<style scoped lang="scss">

    @keyframes slide-in {
        100% { transform: translateY(0%); }
    }

    @keyframes slide-out {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(0%); }
    }

    .faq-wrapper {
        font-family: 'YoungSerif-Regular', serif;

        h2 {
            font-size: 32px;
            margin: 30px 0 113px 0;
        }

        .question-wrapper {
            font-family: Roboto, sans-serif;
            border-top: 1px solid #000000;
            padding: 30px 0;


            &:last-child {
                border-bottom: 1px solid #000000;
                margin-bottom: 200px;
            }

            .question-header {
                display: flex;
                cursor: pointer;
                position: relative;
                z-index: 2;
                overflow: hidden;
                background: white;
                align-items: center;
                justify-content: space-between;
                transition: opacity .2s ease-in-out;

                &:hover .question {
                    opacity: 0.7;
                }

                .question {
                    font-size: 20px;
                }

                .plus-minus-toggle {
                    cursor: pointer;
                    position: relative;
                    top: 0;
                    height: 32px;
                    width: 32px;
                    &:before,
                    &:after{
                        background: #000;
                        content: '';
                        height: 1px;
                        left: 0;
                        position: absolute;
                        top: 16px;
                        width: 32px;
                        transition: transform 500ms ease;
                    }
                    &:after {
                        transform-origin: center;
                    }
                    &.plus {
                        &:after {
                            transform: rotate(90deg);
                        }
                        &:before {
                            transform: rotate(180deg);
                        }
                    }
                }
            }

            .answer-wrapper {
                height: 0;
                position: relative;
                z-index: 1;
                overflow: hidden;
                transition: height, 0.2s ease-in-out;
                line-height: 32px;
                font-size: 15px;

                a {
                    text-decoration: none;
                    transition: opacity, 0.3s ease-in-out;
                    color: #F55800;
                    margin: 0 3px;

                    &:hover {
                        opacity: .9;
                    }
                }

                &.open {
                    transition: height, 0.3s ease-in-out;
                    padding-top: 30px;
                    height: auto;
                }

                ol {
                    margin-top: 14px;
                    list-style: decimal;
                    padding-left: 40px;

                    li {
                        margin-bottom: 10px;

                        span {
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
</style>