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
  import { SELECTED_ASSET_PACKS } from 'store/canvas/types';
  import { mapGetters } from 'vuex';
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
    computed: {
      ...mapGetters({
        selectedAssetPacks: SELECTED_ASSET_PACKS,
      })
    },
    methods: {
      changeStep(step) {
        this.currentStep = step;
      },
    },
    created() {

      if (window.sessionStorage.length > 0) {
        this.activeTab = 'create';
        const landingPacks = getLandingPacks();
        this.selectedAssetPacks = [...new Set([...this.selectedAssetPacks, ...landingPacks.packs])];
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