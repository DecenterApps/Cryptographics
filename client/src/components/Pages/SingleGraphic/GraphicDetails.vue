<template>
    <div class="graphic-details">
        <div class="graphic-meta">
            <p v-if="image.usedAssets && backgroundAssets === 1">This cryptographic contains {{image.usedAssets.length}}
                assets, {{ backgroundAssets }} of which is a background.<br> The assets are from the following packs:
            </p>

            <p v-if="image.usedAssets && backgroundAssets > 1">This cryptographic contains {{image.usedAssets.length}}
                assets, {{ backgroundAssets }} of which are backgrounds.<br> The assets are from the following packs:
            </p>

            <p v-if="image.usedAssets && backgroundAssets === 0">This cryptographic contains {{image.usedAssets.length}}
                assets, none of which are backgrounds.<br> The assets are from the following packs:</p>

            <p v-if="image.usedAssets.length === 1">This cryptographic contains {{image.usedAssets.length}} asset.<br>
                The asset is from the following pack:</p>

            <div class="asset-packs">
                <router-link
                        :to="'/asset-pack/' + assetPack.id"
                        v-for="(assetPack, index) in assetPacks"
                        :key="index">
                    <asset-box
                            :key="index"
                            :assetPack="assetPack"
                            :small="true"
                            :hover="true"
                            color="#eee"
                            action="zoom"
                    ></asset-box>
                </router-link>
            </div>
        </div>
        <div class="graphic-meta">
            <div class="graphic-name">
                <h3 class="large-title">{{ image.title }} <span class="graphic-id">no. {{ utils.padToFour(parseInt(image.id)) }}</span>
                </h3>
                <div v-if="image.creatorMeta.username !== image.username" class="user-links-wrapper">
                    <div class="user-link-wrapper" v-if="image.creatorMeta">
                        <user-link :to="'/user/' + image.creator" :name="image.creatorMeta.username"
                                   :avatar="image.creatorMeta.avatar" color="black" additionalClass="ellipsis" />
                        <span class="title">Creator</span>
                    </div>
                    <div class="user-link-wrapper" v-if="image.owner">
                        <user-link :to="'/user/' + image.owner" :name="image.username" :avatar="image.avatar"
                                   color="black" additionalClass="ellipsis" />
                        <span class="title">Owner</span>
                    </div>
                </div>
                <div v-if="image.creatorMeta.username === image.username" class="user-links-wrapper">
                    <div class="user-link-wrapper" v-if="image.creatorMeta">
                        <user-link :to="'/user/' + image.creator" :name="image.creatorMeta.username"
                                   :avatar="image.creatorMeta.avatar" color="black" additionalClass="ellipsis" />
                        <span class="title">Creator/Owner</span>
                    </div>
                </div>
                <div v-if="image.description.length > 0" class="description-label">Description:</div>
                <p class="description">{{ image.description }}</p>
            </div>
            <div
                    v-if="isLogged && !isForSale"
                    class="graphic-controls"
                    :class="{ sell: sellGraphic }">
                <separator></separator>
                <div class="bottom-controls" v-if="!sellGraphic">
                    <cg-button
                            button-style="secondary"
                            @click="openModal({ name: 'transferHistory', data: { image } })"
                    >
                        Ownership history
                    </cg-button>
                    <div class="button-group">
                        <cg-button button-style="secondary" @click="$emit('showPrintForm')">Order print</cg-button>
                        <cg-button @click="sellGraphic = !sellGraphic">List for sale</cg-button>
                    </div>
                </div>
                <div class="bottom-controls" v-else>
                    <div></div>
                    <div class="button-group">
                        <cg-button button-style="secondary" @click="() => {
                            this.errors.sellPrice = false;
                            this.sellGraphic = !this.sellGraphic;
                        }">
                            Cancel
                        </cg-button>

                        <cg-input
                                v-on:input="checkErrors('sellPrice')"
                                :inputStyle="errors.sellPrice ? 'input error' : 'input'"
                                v-model="sellPrice"
                                inputType="number"
                                type="text"
                                placeholder="Enter price in ETH"
                        />
                        <cg-button @click="submitImageForSale">List for sale</cg-button>
                    </div>
                </div>
            </div>
            <div
                    v-if="isLogged && isForSale"
                    class="graphic-controls"
            >
                <separator></separator>
                <div class="bottom-controls" v-if="!changePrice">
                    <div></div>
                    <div class="price-controls">
                        <price :value="image.price" />
                        <cg-button button-style="secondary" class="remove-button" @click="removeFromMarketPlace">
                            Cancel listing
                        </cg-button>
                        <cg-button button-style="secondary" class="remove-button" @click="changePrice = true">
                            Change price
                        </cg-button>
                        <cg-button @click="$emit('showPrintForm')">Order print</cg-button>
                    </div>
                </div>
                <div class="bottom-controls" v-else>
                    <div></div>
                    <div class="price-controls">
                        Current price
                        <price :value="image.price" />
                        <cg-button button-style="secondary" class="remove-button" @click="() => {
                            this.errors.sellPrice = false;
                            this.changePrice = !this.changePrice;
                        }">Cancel
                        </cg-button>
                        <cg-input
                                v-on:input="checkErrors('sellPrice')"
                                :inputStyle="errors.sellPrice ? 'input error' : 'input'"
                                v-model="sellPrice"
                                inputType="number"
                                type="text"
                                placeholder="Enter price in ETH"
                        />
                        <cg-button button-style="primary" class="remove-button" @click="submitImageForSale">
                            Change price
                        </cg-button>
                    </div>
                </div>
            </div>
            <div
                    class="graphic-controls buy"
                    v-if="isForSale && !isLogged">
                <separator></separator>
                <div class="bottom-controls">
                    <cg-button
                            button-style="secondary"
                            @click="openModal({ name: 'transferHistory', data: { image } })"
                    >
                        Ownership history
                    </cg-button>

                    <div class="price-controls">
                        <price :value="image.price" />
                        <div class="button-group">
                            <cg-button @click="submitBuyImage">Buy</cg-button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                    class="graphic-controls"
                    v-if="!isForSale && !isLogged"
            >
                <separator></separator>
                <div class="bottom-controls">
                    <cg-button
                            button-style="secondary"
                            @click="openModal({ name: 'transferHistory', data: { image } })"
                    >
                        Ownership history
                    </cg-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { getUserInfo, sellImage, cancelSell, buyImage } from 'services/ethereumService';
  import utils from 'services/utils';
  import { mapActions } from 'vuex';
  import { TOGGLE_MODAL, TOGGLE_LOADING_MODAL, CHANGE_LOADING_CONTENT, HIDE_LOADING_MODAL } from 'store/modal/types';

  export default {
    name: 'GraphicDetails',
    data: () => ({
      sellGraphic: false,
      changePrice: false,
      sellPrice: '',
      errors: {
        sellPrice: false,
      },
      backgroundAssets: 0,
      utils
    }),
    props: {
      image: {
        type: Object,
      },
      username: {
        type: String,
      },
      isLogged: {
        type: Boolean
      },
      isForSale: {
        type: Boolean
      },
      assetPacks: {
        type: Array,
        default: [],
      },
      userAddress: {
        type: String,
        default: '0x0',
      },
      getData: {
        type: Function,
        default: () => {},
      }
    },
    created() {
      this.image.usedAssetsInfo.forEach(asset => {
        Math.floor((asset[2] / 100) % 10) === 1 ? this.backgroundAssets += 1 : null;
      });
    },
    methods: {
      ...mapActions({
        openModal: TOGGLE_MODAL,
        toggleLoadingModal: TOGGLE_LOADING_MODAL,
        closeLoadingModal: HIDE_LOADING_MODAL,
        changeLoadingContent: CHANGE_LOADING_CONTENT,
      }),
      checkErrors(toCheck = '') {
        const checkAll = !toCheck;

        if (toCheck === 'sellPrice' || checkAll) this.errors.sellPrice = !this.sellPrice || this.sellPrice === 0;

        return Object.keys(this.errors).filter(key => this.errors[key]).length > 0;
      },
      async submitImageForSale() {
        if (this.checkErrors()) return;
        this.toggleLoadingModal('Please confirm the transaction in MetaMask.');
        const transactionPromise = await sellImage(this.userAddress, this.image.id, this.sellPrice);
        this.changeLoadingContent('Please wait while the transaction is written to the blockchain. ' +
          'Your cryptographic will be listed shortly.');
        const result = await transactionPromise();
        this.sellGraphic = false;
        this.changePrice = false;
        const id = result.events.SellingImage.returnValues.imageId;
        this.closeLoadingModal();
        // this.$router.push(`/cryptographic/${id}`);
        this.getData();
        this.openModal('Cryptographic successfully submitted for sale.');
        this.$emit('updateUI');
      },
      async removeFromMarketPlace() {
        this.toggleLoadingModal('Please confirm the transaction in MetaMask.');
        const transactionPromise = await cancelSell(this.userAddress, this.image.id);
        this.changeLoadingContent('Please wait while the transaction is written to the blockchain. ' +
          'Your cryptographic\'s sale will be canceled shortly.');
        const result = await transactionPromise();
        console.log(result);
        this.closeLoadingModal();
        this.getData();
        // this.$router.push(this.$router.currentRoute);
        this.openModal('Cryptographic successfully removed from the marketplace.');
        this.$emit('updateUI');
      },
      async submitBuyImage() {
        if (!this.userAddress ||  this.userAddress === '0x0') {
            const { userAgent: ua } = navigator;
            const isMobile = ua.includes('Android') || ua.includes('iPad') || ua.includes('iPhone');
            if (isMobile) return this.openModal({ name: 'coinbaseInfo' });
            if (!isMobile) return this.openModal('metaMaskInfo');
        }

        this.toggleLoadingModal('Please confirm the transaction in MetaMask.');
        const transactionPromise = await buyImage(this.userAddress, this.image.id, this.image.price);
        this.changeLoadingContent('Please wait while the transaction is written to the blockchain. ' +
          'Your will receive this cryptographic shortly.');
        const result = await transactionPromise();
        const id = result.events.ImageBought.returnValues.imageId;
        this.closeLoadingModal();
        this.getData();
        // this.$router.push(`/cryptographic/${id}`);
        this.openModal('Cryptographic successfully bought.');
        this.$emit('updateUI');
      },
    },
  };
</script>

<style scoped lang="scss">
    .graphic-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
    }

    .asset-packs {
        margin-bottom: 13px;
        a {
            margin: 0 5px;
        }
    }

    .graphic-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-weight: 300;
    }

    .graphic-name {
        width: 100%;
        .graphic-id {
            font-family: Roboto, sans-serif;
            font-size: 12px;
            margin-left: 10px;
            font-weight: bold;
            color: #858585;
        }
        .description-label {
            margin-top: 20px;
            margin-bottom: 12px;
            font-size: 12px;
            font-weight: bold;
            color: #717171;
        }
        .description {
            margin-top: 10px;
            font-family: Roboto, sans-serif;
            font-weight: 300;
            line-height: 19px;
            margin-bottom: 0;
        }
        .large-title {
            margin-bottom: 10px;
            position: relative;
            display: flex;
        }
        .user-links-wrapper {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            padding-top: 10px;
            .user-link-wrapper {
                position: relative;
                &:first-of-type {
                    margin-bottom: 15px;
                }
                .user {
                    max-width: 300px;
                    .name {
                        margin-top: -10px;
                    }
                }
                .title {
                    position: absolute;
                    color: #9D9D9D;
                    font-size: 12px;
                    left: 43px;
                    top: 25px;
                }
            }
        }
    }

    .graphic-address {
        font-size: 12px;
        strong {
            font-weight: bold;
            display: block;
            margin-bottom: 5px;
        }
        .address {
            color: #1F34F7;
            display: block;
        }
    }

    .graphic-controls {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        .bottom-controls {
            display: flex;
            justify-content: space-between;
            width: 100%;

            .price-controls {
                display: flex;
                align-items: center;

                .price {
                    max-width: 105px;
                    margin-right: 10px;
                    font-weight: normal;

                    &:before {
                        bottom: 1px;
                    }
                }
            }
        }

        .line-separator {
            margin: 25px 0;
        }
        &.sell {
            flex-direction: column;
            margin-top: 0;
        }
        &.buy {
            align-items: center;

            .price-controls {
                .button {
                    padding: 9px 34px;
                }
            }
        }
        button {
            margin: 0 10px;
            &:first-of-type {
                margin-left: 0;
            }
            &:last-of-type {
                margin-right: 0;
            }
        }
        .price {
            margin-left: 16px;
        }
        .default-input {
            width: 100%;
            margin-bottom: 10px;
        }

        .price-wrapper {
            margin-left: 16px;

            .price {
                margin-left: 0;
            }

            .history {
                cursor: pointer;
                color: #717171;
                font-size: 12px;
                margin-top: 5px;
                transition: color 0.2s ease-in-out;

                &:hover {
                    color: lighten(#717171, 20);
                }
            }
        }
    }
</style>


