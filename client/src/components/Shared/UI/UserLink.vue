<template>
    <router-link
        class="user"
        :to="to">
        <img
            class="avatar"
            :class="color"
            :src="avatar">
        <span class="name" :class="color">
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
        },
        color: {
            type: String,
            default: 'grey'
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
        border-radius: 50%;
        width: 33px;
        height: 33px;
        margin-right: 10px;
        &.white {
            background-color: #fff;
        }
        &.grey {
            background-color: #9D9D9D;
        }
    }
    .name {
        font-size: 12px;
        font-family: Roboto, sans-serif;
        color: inherit;
        &.white {
            color: #fff;
        }
        &.grey {
            color: #858585;
        }
    }
}
</style>
