<template>
    <div class="asset-box"
         :class="[selected ? 'selected' : '', small ? 'small' : '', hover ? 'has-hover' : '']"
         :style="{backgroundColor: color}"
         v-on="$listeners"
    >
        <img :src="assetPack.packCoverSrc" alt="">
        <overlay>
            <div v-if="small" class="overlay-content">
                <button-icon v-if="action === 'zoom'" size="16px" icon-type="zoom"/>
                <button-icon v-if="action === 'close'" size="16px" icon-type="close"/>
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
      },
      hover: {
        type: Boolean,
        default: false,
      },
      action: {
        type: String,
        default: '',
      }
    }
  };
</script>

<style lang="scss" scoped>
    .asset-box {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: space-around;
        height: 120px;
        width: 165px;
        font-family: inherit;
        background-color: #eee;
        color: #494946;
        text-decoration: none;
        cursor: pointer;
        box-sizing: border-box;
        border: 4px solid #D9D9D9;

        &.small {
            height: 64px;
            width: 85px;

            .overlay-content {
                display: flex;
                align-items: center;
                justify-content: center;
            }
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
            border-color: #000;
        }

        &.has-hover:hover {
            .overlay {
                opacity: 1;
            }
        }
    }
</style>
