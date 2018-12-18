<template>
  <div class="create-art-wrapper">
    <step-header
      :currentStep="currentStep"
      :steps="['Select Asset Packs', 'Generate cryptographic', 'Claim cryptographic']"
      v-on:stepChange="changeStep"
      class="main-steps"
    />
    <step-header
      :currentStep="currentStep"
      :steps="['Select', 'Generate', 'Claim']"
      v-on:stepChange="changeStep"
      class="mobile-steps"
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
import AssetPicker from "./AssetPicker/AssetPicker.vue";
import GraphicBuilder from "./GraphicBuilder/GraphicBuilder.vue";
import {
  TOGGLE_ASSET_PACK,
  SELECTED_ASSET_PACKS,
  CLEAR_ASSET_PACKS
} from "store/canvas/types";
import { TOGGLE_MODAL } from "store/modal/types";
import { METAMASK_APPROVED, METAMASK_ADDRESS } from "store/user-config/types";
import { mapActions, mapGetters } from "vuex";
import { getLandingPacks } from "services/ethereumService";
import StepHeader from "shared/StepHeader/StepHeader";
import { isMetaMaskLocked } from "services/helpers";

export default {
  name: "CreateGraphic",
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
      approvedMetamask: METAMASK_APPROVED,
      userAddress: METAMASK_ADDRESS
    })
  },
  methods: {
    ...mapActions({
      toggleAsset: TOGGLE_ASSET_PACK,
      clearAssetPacks: CLEAR_ASSET_PACKS,
      openModal: TOGGLE_MODAL
    }),
    async changeStep(step) {
      const { currentProvider: cp } = window.web3;
      const hasWallet = !!cp.isMetaMask || !!cp.isStatus || !!cp.isTrust || !!cp.isToshi;
      if (!this.userAddress) {
        return this.openModal("metaMaskInfo");
      }

      window.scrollTo(0, 0);
      this.currentStep = step;
      console.log("CHANGING STEP ", step);
      const events = {
        "0": 3,
        "1": 4,
        "2": 2
      };
      if (window._paq) window._paq.push(["trackGoal", events[step]]);
    }
  },
  async mounted() {
    const html = document.querySelector("html");
    html.classList.remove("no-scroll");
    if (window.sessionStorage.length > 0) {
      this.changeStep(1);
      const landingPacks = getLandingPacks();
      const packs = landingPacks.packs;
      packs.map(pack => this.toggleAsset(pack));
    } else if (window.location.search.length > 5) this.changeStep(1);
    else if (this.$route.query.selected && this.selectedAssetPacks.length > 0)
      this.changeStep(1);
    else this.changeStep(0);
  },
  beforeDestroy() {
    this.clearAssetPacks();
  }
};
</script>

<style scoped lang="scss">
.full-width {
  background-color: #d9d9d9;
}

.create-art-wrapper {
  background-color: #d9d9d9;
  min-height: 100vh;
}
.mobile-steps {
  display: none;
}
@media screen and (max-width: 768px) {
  .mobile-steps {
    display: flex;
  }
  .main-steps {
    display: none;
  }
}
</style>