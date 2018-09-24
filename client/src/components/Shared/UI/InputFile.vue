<template>
    <div class="input-file">
        <label
            class="button"
            :class="buttonStyle">
        <span>Upload image</span>
            <input
                class="input"
                :id="id"
                type="file"
                :multiple="multiple"
                :size="maxFiles"
                :accept="accept"
                v-on="$listeners">
        </label>
        <div class="info">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InputFile',
    props: {
        maxFiles: {
            type: Number,
            default: 50
        },
        id: {
            type: String,
            default: ''
        },
        buttonStyle: {
            type: String,
            default: 'negative'
        },
        accept: {
            type: String,
            default: 'image/*'
        },
        multiple: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped lang="scss">
.input-file {
    display: inline-flex;
    .info {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-around;
        font-size: 12px;
        margin-left: 15px;
        span:first-of-type {
            color: #949494;
        }
    }
}
@import '../../Shared/UI/button-styles';
.button {
    min-width: 100px;
    .input {
        display: none;
    }
}
</style>