<template>
    <input 
        class="input"
        :class="inputStyle"
        :type="inputType"
        v-bind="$attrs">
</template>

<script>
export default {
    name: 'Input',
    props: {
        inputType: {
            type: String,
            default: 'text'
        },
        inputStyle: {
            type: String,
            default: 'input'
        }
    }
}
</script>

<style scoped lang="scss">
.input {
    outline: 0;
    padding: 9px 13px;
    font-size: 12px;
    background-color: transparent;
    color: #000;
    border: 1px solid #000;
    border-radius: 5px;
    margin-bottom: 10px;
}
</style>

