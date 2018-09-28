<template>
    <div class="create-art-wrapper">
        <step-header
                :currentStep="currentStep"
                :steps="['Select Asset Packs', 'Generate Cryptographic', 'Claim Cryptographic']"
                v-on:stepChange="changeStep"
        />
        <layout layout-style="full-screen">
            <asset-picker
                    v-if="currentStep === 0"
                    :currentStep="currentStep"
                    v-on:stepChange="changeStep"
            />
            <graphic-builder
                    v-if="currentStep > 0"
                    :currentStep="currentStep"
                    v-on:stepChange="changeStep"
            />
        </layout>

    </div>
</template>

<script>
  import AssetPicker from './AssetPicker/AssetPicker.vue';
  import GraphicBuilder from './GraphicBuilder/GraphicBuilder.vue';
  import { TOGGLE_ASSET_PACK, SELECTED_ASSET_PACKS, CLEAR_ASSET_PACKS } from 'store/canvas/types';
  import { mapActions, mapGetters } from 'vuex';
  import { getLandingPacks } from 'services/ethereumService';
  import StepHeader from 'shared/StepHeader/StepHeader';

  export default {
    name: 'CreateGraphic',
    components: {
      StepHeader,
      GraphicBuilder,
      AssetPicker
    },
    data: () => ({
      steps: [],
      currentStep: 0,
    }),
    computed: {
      ...mapGetters({
        selectedAssetPacks: SELECTED_ASSET_PACKS,
      })
    },
    methods: {
      ...mapActions({
        toggleAsset: TOGGLE_ASSET_PACK,
        clearAssetPacks: CLEAR_ASSET_PACKS,
      }),
      changeStep(step) {
        this.currentStep = step;
      },
    },
    created() {
      if (window.sessionStorage.length > 0) {
        this.currentStep = 1;
        const landingPacks = getLandingPacks();
        const packs = landingPacks.packs;
        packs.map(pack => this.toggleAsset(pack));
      }
    },
    beforeDestroy() {
      this.clearAssetPacks();
    }
  };
</script>

<style scoped lang="scss">
    .full-width {
        background-color: #D9D9D9;
    }

    .create-art-wrapper {
        background-color: #D9D9D9;
        min-height: 100vh;
    }
</style>