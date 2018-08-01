<template>
    <router-link
        class="user"
        :to="to">
        <img
            class="avatar"
            :src="avatar">
        <span class="name">
            @{{ name }}
        </span>
    </router-link>
</template>

<script>
export default {
    name: 'UserLink',
    props: {
        to: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: 'username'
        },
        avatar: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.user {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    .avatar {
        display: inline-flex;
        background-color: #9D9D9D;
        border-radius: 50%;
        width: 33px;
        height: 33px;
        margin-right: 10px;
    }
    .name {
        color: #858585;
        font-size: 12px;
        font-family: inherit;
    }
}
</style>
