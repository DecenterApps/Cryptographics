<template>
    <div>
        <p class="upload-description">
            Please upload high resolution files.
        </p>
        <p class="upload-description">
            Max file resolution: <span>2480x3508px</span>,
            Max file size: <span>2.5MB.</span>
        </p>
        <p class="upload-description">
            The default <span>Cryptographic canvas</span> is a <span>300DPI A4 (210x297mm)</span>
            paper at a resolution of <span>2480x3508px</span>, with a square format
            of <span>2480x2480px</span> also available (same DPI).
        </p>
        <p class="upload-description">
            Background layers
            that aren’t this exact resolution are aligned with the top
            left corner, regardless if they are larger or smaller than the canvas.
        </p>
    </div>
</template>

<script>
  export default {
    name: 'UploadDescription',
  };
</script>

<style lang="scss" scoped>
    .upload-description {
        font-family: Roboto, sans-serif;
        line-height: 19px;
        font-weight: 300;

        span {
            color: #000;
        }
    }

    .right {
        p.upload-description {
            font-family: Roboto, sans-serif;
            line-height: 30px;
            font-size: 16px;
            font-weight: 300;
            margin-bottom: 45px;
            max-width: none;
        }
    }

</style>