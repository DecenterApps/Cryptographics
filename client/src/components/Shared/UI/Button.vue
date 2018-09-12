<template>
        <button
                class="button"
                :class="buttonStyle"
                :disabled="disabled || loading"
                v-bind="$attrs"
                v-on="$listeners"
        >
            <button-loader v-if="loading" :buttonStyle="buttonStyle"><slot /></button-loader>
            <slot v-if="!loading" />
        </button>
</template>

<script>
  import ButtonLoader from './ButtonLoader';
  export default {
    name: 'Button',
    components: { ButtonLoader },
    props: {
      buttonStyle: {
        type: String,
        default: 'primary'
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      }
    }
  };
</script>

<style scoped lang="scss">
    @import "./button-styles";
</style>

