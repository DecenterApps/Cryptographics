<template>
    <div>
        <slider-gallery/>
        <div class="container">
            <p class="large-title">
                About Cryptographics</p>
            <p class="about-text">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
                feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.
                quis, accumsan porttitor,
                facilisis luctus, metus</p>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'About'
  };
</script>

<style scoped>
    .large-title {
        margin: 30px 0;
    }

    .about-text {
        line-height: 22px;
        margin-bottom: 30px;
    }
</style>