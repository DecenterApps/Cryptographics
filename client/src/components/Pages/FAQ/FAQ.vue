<template>
    <div class="faq-wrapper container">
        <h2>Frequently Asked Questions</h2>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(0)">
                <span class="question">What is a cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[0].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[0].open }">
                A cryptographic is a unique piece of digital artwork randomly created using the Cryptographics DApp and stored on the blockchain by its Creator. Cryptographics are stored on the Ethereum blockchain as one of a kind ERC-721 tokens and they can as such be kept in their owners’ Ethereum wallets and traded with other users.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(1)">
                <span class="question">How do I create a cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[1].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[1].open }">
                <div>
                    Creating a cryptographic is a simple 3-step process. Once you
                    click the <router-link to="/create-cryptographic">Compose</router-link>
                    button the steps are as follows:
                </div>
                <ol>
                    <li>
                        <span>Select Asset Packs</span> where you simply pick the Asset packs whose elements you want to see included in your cryptographic.
                    </li>
                    <li>
                        <span>Generate cryptographic</span> where the Cryptographic DApp generates digital artwork with random assets from the selected Asset packs using a provably random algorithm. You, as the Creator, are free to try and Recompose the cryptographic as many times as you want before deciding to save it. You can also choose to use a square format canvas instead or add a white frame to your cryptographic.
                    </li>
                    <li>
                        <span>Save cryptographic</span> where you name and describe your cryptographic, both in 20 characters or less, before clicking the Claim cryptographic button. This process will store your cryptographic to the blockchain and add the unique ERC-721 token to your MetaMask Ethereum account.
                    </li>
                </ol>
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(2)">
                <span class="question">How do I sell a cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[2].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[2].open }">
                Once you create and save a cryptographic on the blockchain, you can offer it for sale in the
                <router-link to="/gallery">Cryptographics Gallery</router-link> at any point in time. You do this by selecting the cryptographic you want to sell on
                <router-link to="/profile">profile page</router-link>, clicking the List for sale button and setting your desired price. Once you’re done, your cryptographic will be shown with the price you set in the Gallery and other users will be able to buy it from you.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(3)">
                <span class="question">What is an Asset pack?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[3].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[3].open }">
                An Asset pack is a collection of graphic assets bundled together and uploaded to the Cryptographics DApp by an Artist. Every Asset pack has a unique price set by the Artist for the whole pack. A Creator only needs to purchase a certain Asset pack once and can reuse it for any number of cryptographics afterwards without any additional cost. An Asset pack is always sold and bought as a whole, no matter the number of actual assets that were used on a cryptographic.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(4)">
                <span class="question">How do I create an asset pack?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[4].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[4].open }">
                <div>
                    Creating an asset pack is a relatively simple process once you have the actual assets ready for upload. Once you click the
                    <router-link to="/create-asset-pack">Create Asset Pack</router-link>
                    button, these are the three steps you should follow:
                </div>
                <ol>
                    <li>
                        <span>Upload Assets</span> - where you upload the actual graphic files. Please note that the maximum number of assets in an Asset pack is 50. This is also the step where you configure your assets. The options that you can turn on for any of your Assets are Asset scaling, Asset rotation and Background use. An important thing to note is that Asset scaling only works in one direction, reducing the asset size, in order to preserve graphics quality and avoid pixelation.
                    </li>
                    <li>
                        <span>Test Asset Pack</span> - where you can see how your Asset pack behaves in the Cryptographics composer and if it works as you intended it to.
                    </li>
                    <li>
                        <span>Submit Asset Pack</span> - where you need to generate a thumbnail for your Asset pack, name it, put in your desired price and provide an additional description if you want to. Once you click the Submit button, you need to confirm the transaction in MetaMask and that’s it.
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
                You can upload any graphic elements as assets, be it digital art, photography, paintings or drawings. In case the graphics you are uploading are not specifically created by you, they should belong to the public domain, i.e. not be copyrighted. The content of the graphics itself should not be malicious or harmful in any way.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(6)">
                <span class="question">How do I sell an Asset Pack?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[6].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[6].open }">
                There are no additional actions needed to sell an asset pack once you initially submit it to the Cryptographics DApp. It will be available in the Asset Packs collection and Creators will be able to find and select your Asset Pack during the Cryptographics creation process and each time a new Creator uses your Asset Pack you will receive a payment from them in the value you set as the Asset Pack price. You can check your funds balance on your profile page at any point in time. Please note that once a Creator purchases your Asset Pack, they can reuse it for any number of cryptographics in the future without any additional payments, so please plan and set your Asset Packs' prices accordingly.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(7)">
                <span class="question">What is MetaMask and why do I need it?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[7].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[7].open }">
                MetaMask is a Web3.0 enabling extension for your browser that interacts with the Ethereum blockchain and allows you to run Ethereum DApps right in your browser. Please make sure to keep your MetaMask account safe and not lose your passwords, since losing access to your account would consequently mean losing your cryptographics or potentially even your your Ether funds. MetaMask is available for all current major browsers, including Chrome, Firefox, Opera and Vivaldi and you should always get MetaMask from
                <a target="_blank" rel="noopener noreferrer" href="https://metamask.io/">the official website.</a>
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(8)">
                <span class="question">How can I buy a cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[8].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[8].open }">
                Buying a cryptographic is as simple as finding a cryptographic that you like and clicking the Buy button once you open its page. However, not all cryptographics will always be on sale, as Creators and Collectors can choose to keep them for themselves after creating or buying them.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(9)">
                <span class="question">Is the cryptographic creation process truly random and is there a way to cheat and save specific, pre-made art as a cryptographic?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[9].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[9].open }">
                The Cryptographics composing algorithm uses multiple randomized variables and hashing functions in order to generate the final seed that is then used to compose the randomly selected, positioned and scaled assets into a single cryptographic. This process makes it impossible to come to the same final seed two times, meaning that no two cryptographics can be exactly the same. Furthermore, even if at some point in the future a seed that has already been used for a saved cryptographic is generated again, the Cryptographics smart contract would not allow it to be used. All of this means that no two cryptographics can ever be truly the same.
                <br>
                One thing that users can do to cheat is create a final graphic on their own, submit an asset pack containing that single graphic and use it to create the same looking cryptographic. However, since the true source of cryptographics is fully disclosed, forged cryptographics have no quantifiable value.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(10)">
                <span class="question">Where are cryptographics stored?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[10].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[10].open }">
                Once saved, your cryptographic's distinct metadata is stored on the Ethereum blockchain in the form of a unique, non-fungible ERC-721 token and tied to your Ethereum wallet, making you the owner. All of the actual graphic assets are stored on the InterPlanetary File System (IPFS) and each time you open a saved cryptographic in the Cryptographics DApp it is perfectly recreated using its unique metadata and consisting assets. The only pre-composed cryptographics that are kept stored as singular image files are low-resolution thumbnails of existing cryptographics shown in the Gallery.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(11)">
                <span class="question">Can I earn Ether by using Cryptographics?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[11].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[11].open }">
                There are multiple ways to earn Ether using Cryptographics. Firstly, as an Artist, you are welcome to submit Asset packs and set your price for them. For reach sale of an Asset pack, Artist receives 95% of the payment. Secondly, as a Creator, you can list any of your cryptographics for sale in the Gallery and for each cryptographic sold you will also receive 95% of the payment. You can check your current earnings on your profile page, where you can also withdraw Ether to your wallet.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(12)">
                <span class="question">How are funds distributed when selling and purchasing asset packs or cryptographics?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[12].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[12].open }">
                Whenever an Asset pack is bought, the Artist receives 95% of the Creator's payment, while the Cryptographics team receives the remaining 5%. Additionally, whenever someone buys a cryptographic, the seller receives 95% of the payment, with 2% going to the original Creator and 3% to the Cryptographics team.
            </div>
        </div>

        <div class="question-wrapper">
            <div class="question-header" v-on:click="myFilter(13)">
                <span class="question">I have a question that is not answered here, how can I get in touch?</span>
                <span class="plus-minus-toggle" v-bind:class="{ plus: !items[13].open }"></span>
            </div>

            <div class="answer-wrapper" v-bind:class="{ open: items[13].open }">
                For any questions that are not answered here, feel free to join the <a href="https://discord.gg/xnhfYRS" target="_blank">Cryptographics Discord server</a> or post in the <a href="https://www.reddit.com/r/cryptographics/" target="_blank">Cryptographics subreddit</a>. You can also reach out to us directly via <a href="mailto:cryptographics@decenter.com">email</a>.
            </div>
        </div>
    </div>
</template>

<script>
  const items = [];
  for (let i = 1; i <= 15; i++) items.push({ id: i, open: false })

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
                    line-height: 32px;
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
                max-width: 60%;

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