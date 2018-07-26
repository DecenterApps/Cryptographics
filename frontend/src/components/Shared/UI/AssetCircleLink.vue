<template>
    <router-link 
        class="asset"
        :to="to"
        :style="{backgroundColor: color}"
        :name="name"
        v-on="$listeners">
        {{ name }}
    </router-link>
</template>

<script>
export default {
    name: 'AssetCircleLink',
    props: {
        name: {
            type: String,
            default: '00'
        },
        color: {
            type: String,
            default: '#494946'
        },
        to: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.asset {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 33px;
    width: 33px;
    border-radius: 50%;
    font-size: 12px;
    font-family: inherit;
    background-color: #494946;
    color: #fff;
    text-decoration: none;
}
</style>
