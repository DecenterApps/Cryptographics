<template>
    <button
            :class="['button','ico-button', classProp]"
            v-bind="$attrs"
            v-on="$listeners">
        <ico-download v-if="iconType === 'download'" :width="width" :height="height" :color="color" />
        <ico-magnifier v-if="iconType === 'zoom'" :size="size" :color="color" />
        <ico-close v-if="iconType === 'close'" :size="size" :color="color" />
        <ico-rotate v-if="iconType === 'rotate'" :width="width" :height="height" :color="color" />
        <ico-scale v-if="iconType === 'scale'" :size="size" :color="color" />
        <ico-info v-if="iconType === 'info'" :size="size" :color="color" />
        <ico-recompose v-if="iconType === 'recompose'" :size="size" :color="color" />
    </button>
</template>

<script>
  import IcoDownload from './Icons/IcoDownload.vue';
  import IcoMagnifier from './Icons/IcoMagnifier.vue';
  import IcoClose from './Icons/IcoClose.vue';
  import IcoRotate from './Icons/IcoRotate.vue';
  import IcoScale from './Icons/IcoScale.vue';
  import IcoInfo from './Icons/IcoInfo.vue';  
  import IcoRecompose from './Icons/IcoRecompose.vue';

  export default {
    name: 'ButtonIcon',
    props: {
      iconType: {
        type: String,
        default: 'download'
      },
      color: {
        type: String
      },
      size: {
        type: String
      },
      width: {
        type: String
      },
      height: {
        type: String
      },
      classProp: {
        type: String,
        default: '',
      }
    },
    components: {
      IcoDownload,
      IcoMagnifier,
      IcoClose,
      IcoRotate,
      IcoScale,
      IcoInfo,
      IcoRecompose,
    }
  };
</script>

<style lang="scss" scoped>
    .button {
        margin: 0;
        padding: 0;
        outline: none;
        background: transparent;
        border: none;
        cursor: pointer;
        &.info {
          cursor: help;
      }
    }
    
</style>


