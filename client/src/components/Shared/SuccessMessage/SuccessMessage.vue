<template>
    <div class="success-message">
        <h1 class="large-title">
            {{ content }}
        </h1>

        <img class="round-logo" :src="roundLogo" alt="">
    </div>
</template>

<script>
  import { ipfsNodePath } from 'config/constants';
  import roundLogo from 'assets/round-logo.png';

  export default {
    name: 'SuccessMessage',
    props: ['content'],
    data: () => ({
      ipfsNodePath,
      newUsername: '',
      roundLogo,
    })
  };
</script>

<style lang="scss" scoped>
    .success-message {

        .round-logo {
            position: absolute;
            bottom: -28px;
            height: 56px;
            width: 56px;
            left: 50%;
            margin-left: -28px;
        }
    }

    .large-title {
        font-size: 20px;
        max-width: 250px;
        line-height: 26px;
        text-align: center;
    }
</style>
