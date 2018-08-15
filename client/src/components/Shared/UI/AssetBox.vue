<template>
    <div class="asset-box"
         :class="[selected ? 'selected' : '', small ? 'small' : '']"
         :style="{backgroundColor: color}"
         v-on="$listeners"
    >
        <img :src="assetPack.packCoverSrc" alt="">
        <overlay>
            <div v-if="small">
                lol
            </div>
            <div v-if="!small" class="overlay-content">
                <p class="small-title pack-name">{{ assetPack.packName }}</p>
                <p class="price">Ξ {{ assetPack.price }}</p>
            </div>
        </overlay>
        <div v-if="selected" class="selected-text small-title">
            Selected
        </div>
    </div>
</template>

<script>
  export default {
    name: 'AssetBox',
    props: {
      assetPack: {
        type: Object,
        default: {}
      },
      color: {
        type: String,
        default: '#494946'
      },
      selected: {
        type: Boolean,
        default: false
      },
      small: {
        type: Boolean,
        default: false,
      }
    }
  };
</script>

<style lang="scss" scoped>
    .asset-box {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        width: 140px;
        font-family: inherit;
        background-color: #eee;
        color: #494946;
        text-decoration: none;
        cursor: pointer;
        box-sizing: border-box;

        &.small {
            height: 55px;
            width: 75px;
        }

        .pack-name {
            color: #fff;
            opacity: 1;
        }

        .selected-text {
            position: absolute;
            bottom: -20px;
            left: 0;
            font-size: 10px;
        }

        .price {
            position: absolute;
            font-size: 20px;
            font-family: "YoungSerif-Regular", sans-serif;
            right: 16px;
            bottom: 13px;
            color: #fff;
            margin: 0;
        }

        .overlay-content {
            z-index: 1;
            padding: 13px 16px;
            height: 100%;
            width: 100%;
            line-height: 22px;
        }

        img {
            width: 100%;
            height: 100%;
        }

        &.selected {
            border: 1px solid #000;

            .overlay-content {
                padding: 12px 15px;
            }
            .price {
                right: 15px;
                bottom: 12px;
            }
        }

        &:hover {
            .overlay {
                opacity: 1;
            }
        }
    }
</style>
