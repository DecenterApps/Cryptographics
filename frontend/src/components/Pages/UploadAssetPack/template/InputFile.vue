<template>
    <label
        class="button"
        :class="buttonStyle">
        <span>Browse</span>
        <input
            class="input-file"
            :id="id"
            type="file"
            multiple
            :size="maxFiles"
            :accept="accept"
            v-on="$listeners">
    </label>
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
        }
    }
}
</script>

<style scoped lang="scss">
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
    .input-file {
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