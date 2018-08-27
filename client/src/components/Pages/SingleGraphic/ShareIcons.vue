<template>
    <div class="share-icons">
        <IcoTwitter @click.native="openTwitterShare" />
        <IcoPinterest />
        <IcoReddit />
        <IcoTumblr />
    </div>
</template>

<script>
  import IcoTwitter from '../../Shared/UI/Icons/IcoTwitter';
  import IcoPinterest from '../../Shared/UI/Icons/IcoPinterest';
  import IcoReddit from '../../Shared/UI/Icons/IcoReddit';
  import IcoTumblr from '../../Shared/UI/Icons/IcoTumblr';

  export default {
    name: 'ShareIcons',
    components: { IcoTwitter, IcoPinterest, IcoReddit, IcoTumblr },
    data: () => ({}),
    props: {},
    methods: {
      openTwitterShare() {
        let href = `https://twitter.com/intent/tweet?text=Check%20this%20out%20${document.location.href}`;
        console.log(href);
        window.open(href);
      }
    }
  };
</script>

<style scoped lang="scss">
    .share-icons {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 20px;
        top: 0;

        svg {
            margin-bottom: 20px;
            cursor: pointer;
            opacity: 0.3;

            &:hover {
                opacity: 1;
            }
        }
    }
</style>


