<template>
    <layout layout-style="pulled-left">
        <div class="left">
            <graphic-preview
                    name="YoungSerif"
                    id="518"
                    :image="image"
                    year="2018"
            />
        </div>
        <div class="right">
            <graphic-details
                    v-if="!orderPrint"
                    :image="image"
                    :assetPacks="assetPacksUsed"
                    :username="username"
                    :isLogged="loggedIn"
                    :isForSale="forSale"
                    @showPrintForm="orderPrint = true"
            />
            <print-form v-else />
        </div>
    </layout>
</template>

<script>
  import { METAMASK_ADDRESS, USERNAME } from 'store/user-config/types';
  import { mapGetters } from 'vuex';
  import GraphicPreview from './GraphicPreview.vue';
  import GraphicDetails from './GraphicDetails.vue';
  import PrintForm from './PrintForm.vue';
  import {
    getAssetsOrigins,
    getImageMetadata,
    getUsername,
    getSelectedAssetPacksWithAssetData
  } from 'services/ethereumService';

  export default {
    name: 'SingleGraphic',

    data: () => ({
      orderPrint: false,
      loggedIn: false,
      forSale: false,
      assetPacksUsed: [],
      username: '',
      image: {
        creator: '',
        src: '',
      },
    }),
    components: {
      GraphicPreview,
      GraphicDetails,
      PrintForm
    },
    computed: {
      ...mapGetters({
        userAddress: METAMASK_ADDRESS,
      })
    },
    async created() {
      this.image = await getImageMetadata(this.$route.params.id);
      const packsUsed = await getAssetsOrigins(this.image.usedAssets);
      this.assetPacksUsed = await getSelectedAssetPacksWithAssetData(packsUsed);
      this.username = await getUsername(this.image.creator);
      this.loggedIn = this.image.creator === this.userAddress;
    }
  };
</script>

<style scoped lang="scss">
    .left {
        display: flex;
        align-items: center;
        justify-content: flex-end !important;
        max-width: none !important;
    }
</style>