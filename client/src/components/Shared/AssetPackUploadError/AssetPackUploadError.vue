<template>
    <div class="asset-pack-upload-error">
        <ico-error />

        <h3>Some assets could not have been uploaded</h3>

        <div class="errors-wrapper">
            <div
                    class="error-wrapper"
                    v-for="(error, index) in errors"
                    :key="index"
                    v-bind:class="{last : index === (errors.length - 1)}"
            >
                <div class="file"><span>File:</span> {{ error.file }}</div>
                <div class="error"><span>Error:</span> {{ error.error }}</div>
            </div>
        </div>

        <img class="round-logo" :src="roundLogo" alt="">
    </div>
</template>

<script>
  import IcoError from '../../Shared/UI/Icons/IcoError';
  import roundLogo from 'assets/round-logo.png';

  export default {
    name: 'AssetPackUploadError',
    props: {
      errors: {
        type: Array,
      }
    },
    data: () => ({
      roundLogo,
    }),
    components: { IcoError },
  };
</script>

<style scoped lang="scss">
    .asset-pack-upload-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    h3 {
        text-align: center;
        margin: 30px auto 0 auto;
        font-size: 20px;
        font-family: 'YoungSerif-Regular', serif;
    }

    .errors-wrapper {
        width: 100%;

        .error-wrapper {
            margin-top: 30px;
            line-height: 25px;
            width: 100%;

            &:not(.last) {
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            div {
                margin-bottom: 10px;

                span {
                    font-weight: bold;
                    margin-right: 3px;
                }
            }
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
</style>