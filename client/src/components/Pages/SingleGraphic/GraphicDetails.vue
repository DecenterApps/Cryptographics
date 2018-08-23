<template>
    <div class="graphic-details">
        <div class="graphic-meta">
            <p v-if="image.usedAssets">This Cryptographic contains {{image.usedAssets.length}} assets from the following asset packs:</p>
            <div class="asset-packs">
                <router-link :to="'/asset-pack/' + assetPack.id" v-for="(assetPack, index) in assetPacks">
                    <asset-box
                            :key="index"
                            :assetPack="assetPack"
                            :small="true"
                            color="#eee"
                            action="zoom"
                    ></asset-box>
                </router-link>
            </div>
            <p>Asset packs used in this Cryptographic</p>
        </div>
        <div class="graphic-meta">
            <div class="graphic-name">
                <h3 class="large-title">{{ image.title }}</h3>
                <user-link :to="'/user/' + image.creator" :name="username" :avatar="image.avatar" />
            </div>
            <div v-if="!sellGraphic" class="graphic-address">
                <strong>Cryptographics address:</strong>
                <span class="address">{{ image.creator }}</span>
            </div>
            <div
                    v-if="isLogged && !isForSale"
                    class="graphic-controls"
                    :class="{ sell: sellGraphic }">
                <template v-if="!sellGraphic">
                    <cg-button @click="sellGraphic = !sellGraphic">List for sale</cg-button>
                    <cg-button button-style="transparent" @click="$emit('showPrintForm')">Print</cg-button>
                </template>
                <template v-else>
                    <cg-input v-model="sellPrice" type="text" placeholder="Price in ether" />
                    <div class="button-group">
                        <cg-button
                                button-style="transparent"
                                @click="sellGraphic = !sellGraphic">
                            Cancel
                        </cg-button>
                        <cg-button @click="submitImageForSale">List for sale</cg-button>
                    </div>
                </template>
            </div>
            <div
                    v-if="isLogged && isForSale"
                    class="graphic-controls"
            >
                <cg-button class="remove-button" @click="removeFromMarketPlace">Cancel listing</cg-button>
                <cg-button button-style="transparent" @click="$emit('showPrintForm')">Order print</cg-button>
                <price
                        :value="image.price" />
            </div>
            <div
                    class="graphic-controls"
                    v-if="isForSale && !isLogged">
                <cg-button @click="submitBuyImage">Buy</cg-button>
                <price :value="image.price" />
            </div>
        </div>
    </div>
</template>

<script>
  import { sellImage, cancelSell, buyImage } from 'services/ethereumService';

  export default {
    name: 'GraphicDetails',
    data: () => ({
      sellGraphic: false,
      sellPrice: '',
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
      }
    },
    methods: {
      async submitImageForSale() {
        const result = await sellImage(this.userAddress, this.image.id, this.sellPrice);
      },
      async removeFromMarketPlace() {
        const result = await cancelSell(this.userAddress, this.image.id);
      },
      async submitBuyImage() {
        const result = await buyImage(this.userAddress, this.image.id, this.image.price);
      }
    }
  };
</script>

<style scoped lang="scss">
    .graphic-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
    }

    .graphic-name {
        margin-bottom: 50px;
        .large-title {
            margin-bottom: 10px;
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
        margin-top: 18px;
        display: flex;
        flex-wrap: wrap;
        &.sell {
            flex-direction: column;
            margin-top: 0;
        }
        .button-wrapper {
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
    }
</style>


