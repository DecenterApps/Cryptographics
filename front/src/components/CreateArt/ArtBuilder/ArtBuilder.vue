<template>
    <div class="art-builder-wrapper">
        <div class="left-group">
            <img src="./assets/artbuilder-sample.png" alt="">
        </div>
        <div class="right-group">
            <div class="recreate">
                <button class="default-button no-background">Recreate</button>
            </div>
            <div class="controls">
                <button type="button" v-on:click="changeTab" class="default-button no-background">Select Asset Packs</button>
                <div class="formats">
                    <div class="first-format">
                        <div class="box"></div>
                        1:1
                    </div>
                    <div class="second-format">
                        <div class="box"></div>
                        2:3
                    </div>
                </div>
                <div class="frame">
                    <label>Frame <input type="checkbox" /> </label>
                </div>
                <button class="default-button submit">Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'art-builder',
    methods: {
      changeTab() {
        this.$emit('tabChange', 'picker');
      }
    }
  };
</script>

<style scoped lang="scss">
    .art-builder-wrapper {
        display: flex;
        height: 100%;

        .left-group {
            img {
                height: 100%;
            }
        }

        .right-group {
            box-sizing: border-box;
            padding: 0 30px;
            display: flex;
            align-items: flex-end;

            .recreate {
                margin-right: 260px;
            }
        }

        .formats {
            font-size: 10px;
            color: #7c7c7c;
            display: flex;
            margin: 20px 0;
            justify-content: flex-end;

            .first-format, .second-format {
                text-align: right;
            }

            .first-format {
                .box {
                    width: 38px;
                    height: 38px;
                    background-color: #fff;
                    margin-bottom: 5px;
                }
                margin-right: 20px;
            }
            .second-format {
                .box {
                    width: 28px;
                    height: 38px;
                    background-color: #000;
                    margin-bottom: 5px;
                }
            }
        }

        .frame {
            font-size: 10px;
            color: #7c7c7c;
            text-align: right;
        }

        .default-button.submit {
            background-color: #000;
            color: #fff;
            float: right;
            margin-top: 20px;
        }
    }
</style>