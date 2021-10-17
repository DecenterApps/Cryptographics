<template>
  <div class="meta-mask-info">
    <ico-error/>
    <div>
      <div>
        <div class="text-wrapper secondary">Your wallet is either not connected or is locked. In order to continue you need to connect it or unlock it.</div>
        <cg-button @click="openConnectionModal()">Connect</cg-button>
      </div>
    </div>
    <img class="round-logo" :src="roundLogo" alt>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import roundLogo from "assets/round-logo.png";
import IcoError from "../../Shared/UI/Icons/IcoError";
import { TOGGLE_MODAL } from "store/modal/types";
import { OPEN_CONNECTION_MODAL, LOGIN_METAMASK, SET_APPROVAL } from '../../../store/modules/user-config/types';

export default {
  name: "MetaMaskInfo",
  components: { IcoError },
  data: () => ({
    showMoreInfo: false,
    roundLogo,
  }),
  props: {
    hasMetaMask: {
      type: Boolean
    },
    isLocked: {
      type: Boolean
    },
    isMobile: {
      type: Boolean
    },
    isApproved: {
      type: Boolean
    }
  },
  methods: {
    ...mapActions({
      LOGIN_METAMASK,
      openConnectionModal: OPEN_CONNECTION_MODAL,
      openModal: TOGGLE_MODAL,
      setApproval: SET_APPROVAL
    }),
  }
};
</script>

<style scoped lang="scss">
@import "../UI/button-styles";
.meta-mask-info {
  text-align: center;
  .button {
    margin-bottom: 15px;
  }
  svg {
    display: block;
    margin: auto;
    margin-bottom: 27px;
  }

  h3 {
    text-align: center;
    cursor: pointer;
    margin: 30px auto 0 auto;
    font-size: 20px;
    font-family: "YoungSerif-Regular", serif;
    transition: opacity 0.2s ease-in-out;

    a {
      color: black;
      text-decoration: none;
    }

    &.link {
    }

    &:hover {
      opacity: 0.6;
    }
  }

  .text-wrapper {
    text-align: center;
    line-height: 24px;
    font-size: 14px;
    max-width: 390px;

    span {
      font-weight: bold;
      margin: 0 3px;
    }

    &.secondary {
      margin: 30px 0;
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
}
</style>
