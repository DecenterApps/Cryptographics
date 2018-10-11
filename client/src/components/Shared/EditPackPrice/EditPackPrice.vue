<template>
    <div>
        <h3 class="large-title">Change Asset Pack Price</h3>
        <form
          class="edit-pack-price-modal"
          @submit.prevent="changePrice">
            <div class="left">
              <img
                :src="thumbnail"
                class="thumbnail">
            </div>
            <div class="right">
                <div class="up">
                  <p>Current price:</p>
                  <price
                    :value="price"
                    :showIfFree="true" />
                </div>
                <div class="down">
                  <cg-input
                    inputType="number"
                    v-model="newPrice"
                    placeholder="New price in ETH" />
                  <cg-button
                    type="submit"
                    :disabled="newPrice === '' || newPrice === price">
                    Submit
                  </cg-button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { changeAssetPackPrice } from 'services/ethereumService';
import { TOGGLE_MODAL, SHOW_LOADING_MODAL, HIDE_LOADING_MODAL, CHANGE_LOADING_CONTENT }from 'store/modal/types';
import { METAMASK_ADDRESS } from 'store/user-config/types';

export default {
  name: 'EditPackPrice',
  data: () => ({
    newPrice: '',
  }),
  props: {
    thumbnail: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true,
    },
    assetPackId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      address: METAMASK_ADDRESS
    })
  },
  methods: {
    ...mapActions({
        openLoadingModal: SHOW_LOADING_MODAL,
        closeLoadingModal: HIDE_LOADING_MODAL,
        changeLoadingContent: CHANGE_LOADING_CONTENT,
        openModal: TOGGLE_MODAL,
    }),
    async changePrice() {
      try {
        this.openLoadingModal('Please confirm the transaction in MetaMask.');
        const transactionPromise = await changeAssetPackPrice(parseInt(this.assetPackId), this.newPrice, this.address);
        this.changeLoadingContent('Please wait while the transaction is written to the blockchain. The asset pack price will be changed shortly');
        const result = await transactionPromise();
        this.closeLoadingModal();
        this.openModal('');
        this.openModal('Asset pack price was changed successfully.');
      } catch (e) {
        const message = 'Error: ' + e.message.replace('Returned error: ', '').replace(/Error: /g, '');
        this.openLoadingModal(message, true);
      }
      

      // this.openModal('Cryptographic successfully submitted for sale.');
    }
  }
};
</script>

<style lang="scss" scoped>
    .edit-pack-price-modal {
        display: flex;
        width: 100%;
        .left {
            display: inline-flex;
            align-items: flex-end;
            margin-right: 40px;
            .thumbnail {
                width: 200px;
                height: auto;
                background-color: #d9d9d9;
            }
        }
        .right {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-end;
            .up {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-bottom: 16px;
              p {
                margin-bottom: 6px;
              }
            }
            .down {
              display: flex;
              .input-wrapper {
                margin-right: 15px;
                min-width: 150px;
              }
            }
        }
    }
</style>
