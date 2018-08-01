<template>
    <span 
        class="asset"
        :style="{backgroundColor: color}"
        :name="name"
        v-on="$listeners">
        {{ name }}
    </span>
</template>

<script>
export default {
    name: 'AssetCircle',
    props: {
        name: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: '#494946'
        }
    }
}
</script>

<style lang="scss" scoped>
.asset {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 41px;
    width: 41px;
    border-radius: 50%;
    font-size: 12px;
    font-family: inherit;
    background-color: #eee;
    border: 1px solid transparent; 
    color: #494946;
    text-decoration: none;
}
</style>
