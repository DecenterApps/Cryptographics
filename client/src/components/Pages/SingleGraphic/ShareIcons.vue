<template>
    <div class="share-icons">
        <a @click="open(`http://pinterest.com/pin/create/button/?` +
                    `url=https://cryptographics.app/cryptographic/${image.id}&` +
                    `media=${image.src}&` +
                    `description=${image.title} by ${image.creatorMeta.username}`)"
        >
            <IcoPinterest />
        </a>
        <a @click="open(`https://twitter.com/share?` +
                    `url=https://cryptographics.app/cryptographic/${image.id}&` +
                    `text=${image.title} by ${image.creatorMeta.username}`)"
        >
            <IcoTwitter />
        </a>

        <a @click="open(`http://www.tumblr.com/share/link?` +
                    `url=https://cryptographics.app/cryptographic/${image.id}`)"
        >
            <IcoTumblr />
        </a>
        <!--<IcoReddit />-->
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
    props: ['image'],
    methods: {
      open(link) {
        console.log(link)
        window.open(link, 'share-window', 'width=800, height=400');
      }
    }
  };
</script>

<style scoped lang="scss">
    .share-icons {
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
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


