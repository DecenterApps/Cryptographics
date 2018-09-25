<template>
    <div class="create-art-wrapper">
        <step-header
                :currentStep="currentStep"
                :steps="['Select Asset Pack', 'Generate Cryptographic', 'Claim Cryptographic']"
                v-on:stepChange="changeStep"
        />
        <layout layout-style="full-width gray-bg" layout-content="no-container">
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
  import { TOGGLE_ASSET_PACK } from 'store/canvas/types';
  import { mapActions } from 'vuex';
  import { getLandingPacks } from 'services/ethereumService';
  import StepHeader from '../../Shared/StepHeader/StepHeader';

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
    methods: {
      ...mapActions({
        toggleAsset: TOGGLE_ASSET_PACK,
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