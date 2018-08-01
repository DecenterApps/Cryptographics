<template>
    <div class="input-file">
        <label
            class="button"
            :class="buttonStyle">
        <span>Browse</span>
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
.button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 105px;
    max-height: 33px;
    min-height: 33px;
    padding: 9px;
    font-size: 12px;
    border-radius: 5px;
    cursor: pointer;
    outline: 0;
    text-decoration: none;
    text-align: center;
    text-transform: capitalize;
    white-space: nowrap;
    .input {
        display: none;
    }
}
.positive {
    color: #000;
    background-color: #fff;
    border: 1px solid #fff;
}
.negative {
    color: #fff;
    background-color: #000;
    border: 1px solid #000;
}
.transparent {
    color: #000;
    background: none;
    border: 1px solid #000;
}
</style>