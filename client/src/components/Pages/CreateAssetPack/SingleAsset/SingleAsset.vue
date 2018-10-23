<template>
    <div class="asset">
        <div class="preview-icons">
            {{getAttributes(asset)}}
        </div>
        <img :src="asset.path" />
        <overlay>
            <div class="overlay-icons">
                <template v-if="!isAttributeSelected(asset, 0)">
                    <span>
                        <button-icon
                                icon-type="scale"
                                :color="'#fff'"
                                :classProp="isAttributeSelected(asset, 2) ? 'selected' : ''"
                                @click.native="toggleAttribute(index, 0)"
                        />
                        <span class="description">{{ isAttributeSelected(asset, 2) ? 'Disable' : 'Enable' }} asset scaling</span>
                    </span>
                    <span>
                        <button-icon
                                icon-type="rotate"
                                :color="'#fff'"
                                :classProp="isAttributeSelected(asset, 1) ? 'selected' : ''"
                                @click.native="toggleAttribute(index, 1)"
                        />
                        <span class="description">{{ isAttributeSelected(asset, 1) ? 'Disable' : 'Enable' }} asset rotation</span>
                    </span>
                </template>
                <span>
                    <ico-background
                            :ico-color="'#fff'"
                            :classProp="isAttributeSelected(asset, 0) ? 'selected' : ''"
                            ico-stroke="none"
                            @click.native="toggleAttribute(index, 2)"
                    />
                    <span class="description">{{ isAttributeSelected(asset, 0) ? 'Don\'t use' : 'Use'  }} as background</span>
                </span>
            </div>
            <ico-trash @click.native="remove" />
        </overlay>
    </div>
</template>

<script>

  import IcoTrash from 'shared/UI/Icons/IcoTrash.vue';
  import IcoBackground from 'shared/UI/Icons/IcoBackground.vue';

  export default {
    name: 'SingleAsset',
    components: {
      IcoTrash,
      IcoBackground,
    },
    props: {
      asset: {
        default: {},
      },
      index: {
        default: 0,
      },
      remove: {
        default: () => {},
      },
      toggleAttribute: {
        default: () => {},
      }
    },
    methods: {
      getAttributes(asset) {
        let attribute = asset.attribute.toString();
        let words = ['BGD', 'ROT', 'SCA'];
        let attributes = [];
        for (let i = 0; i < attribute.length; i++) {
          if (attribute.charAt(i) === '1') {
            attributes.push(words[i]);
            if (i === 0) break;
          }
        }
        return attributes.join(' — ');
      },
      isAttributeSelected(asset, position) {
        return asset.attribute.toString().charAt(position) === '1';
      },
    },
    async created() {
    }
  };
</script>

<style scoped lang="scss">
    .asset {
        position: relative;
        background: #ECECEC;
        margin-bottom: 20px;
        width: 206px;
        height: 206px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        padding: 10px;
        img {
            max-width: 100%;
            max-height: 100%;
        }
        &:nth-child(3n + 2) {
            margin: 0 20px;
        }
        &:nth-last-child(-n+3) {
            margin-bottom: 0;
        }

        .ico-trash {
            position: absolute;
            top: 15px;
            right: 15px;
        }

        .overlay-icons {
            display: flex;
            flex-direction: column;
            position: absolute;
            bottom: 15px;
            left: 15px;

            & > span {
                display: inline-flex;
                align-items: center;
                margin-bottom: 10px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            .description {
                display: none;
                color: #fff;
                font-family: Roboto, sans-serif;
                font-size: 12px;
                padding-left: 10px;
            }
        }

        .overlay {
            svg, button {
                opacity: 0.5;

                &.selected {
                    opacity: 1;
                }

                &:hover {
                    opacity: 0.8;

                    & + span {
                        display: inline;
                    }
                }
                &:active {
                    opacity: 1;
                }
            }
        }

        svg, button {
            cursor: pointer;
        }

        .preview-icons {
            position: absolute;
            bottom: -15px;
            left: 0;
            display: flex;
            font-size: 12px;
            line-height: 14px;
            flex-direction: column;
        }

        &:hover {
            .overlay {
                opacity: 1;
            }
            button.delete {
                display: block;
            }
            button.background {
                display: block;
            }
        }
        button.background, button.delete {
            display: none;
        }
    }
</style>