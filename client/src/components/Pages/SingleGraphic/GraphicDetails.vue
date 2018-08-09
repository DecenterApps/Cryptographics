<template>
    <div class="graphic-details">
        <div class="graphic-meta">
            <div class="assets-pack">
                <asset-circle-link to="/assetpackurl" name="03" color="#492246"/>
                <asset-circle-link to="/assetpackurl" name="01" color="#494946"/>
                <asset-circle-link to="/assetpackurl" name="05" color="#797979"/>
            </div>
            <p>Assets pack used in this Cryptographic</p>
        </div>
        <div class="graphic-meta">
            <div class="graphic-name">
                <h3 class="large-title">{{ name }}</h3>
                <user-link to="/userurl" name="username" avatar="/avatarurl"/>
            </div>
            <div v-if="!sellGraphic" class="graphic-address">
                <strong>cryptographics address:</strong>
                <span class="address">{{ address }}</span>
            </div>
            <div
                v-if="isLogged"
                class="graphic-controls"
                :class="{ sell: sellGraphic }">
                <template v-if="!sellGraphic">
                    <button-link to="/gallery">My Gallery</button-link>
                    <cg-button @click="sellGraphic = !sellGraphic">Sell</cg-button>
                    <cg-button @click="$emit('showPrintForm')">Print</cg-button>
                </template>
                <template v-else>
                    <cg-input type="text" placeholder="value"/>
                    <div class="button-group">
                        <cg-button
                            button-style="transparent"
                            @click="sellGraphic = !sellGraphic">
                            Cancel
                        </cg-button>
                        <cg-button>Sell</cg-button>
                    </div>
                </template>
            </div>
            <div
                class="graphic-controls"
                v-if="isForSale && !isLogged">
                <cg-button>Buy</cg-button>
                <price
                    value="0.05"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GraphicDetails',
    data: () => ({
      sellGraphic: false
    }),
    props: {
        name: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        isLogged: {
            type: Boolean
        },
        isForSale: {
            type: Boolean
        }
    }
}
</script>

<style scoped lang="scss">
.graphic-details {
    display: flex;
    flex-direction: column;
}
.assets-pack {
    margin-bottom: 13px;
    .asset {
        margin: 0 5px;
        &:first-of-type {
            margin-left: 0;
        }
        &:last-of-type {
            margin-right: 0;
        }
    }    
}
.graphic-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    &:first-of-type {
        margin-bottom: 185px;
    }
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
    .button {
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


