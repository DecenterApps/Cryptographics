<template>
    <div v-if="layoutStyle === 'pulled-left'" class="background-wrapper">
        <div class="black-bg"></div>
        <div class="content-wrapper">
            <template v-if="layoutContent === 'tabbed'">
                <slot/>
            </template>
            <div v-else class="container">
                <slot/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Layout',
    props: {
        layoutStyle: {
            type: String,
            default: 'pulled-left'
        },
        layoutContent: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
    background-color: #D9D9D9;
    min-height: calc(100vh - 280px);
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    position: relative;
    &:before {
        content: "";
        background-color: #D9D9D9;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -100%;
        width: 100%;
    }
    .container {
        padding: 80px 0;
        margin-right: 0;
        display: flex;
        .left {
            max-width: 335px;
            width: 100%;
            display: inline-flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .right {
            display: flex;
            margin-left: 50px;
            width: 100%;
        }
    }
    @media screen and (max-width: 1280px) {
        width: 100%;
        left: 0;
        .container {
            width: 100%;
            margin: 0 auto;
            padding: 40px 20px;
        }
    }
    @media screen and (max-width: 767px) {
        .container {
            flex-direction: column;
            align-items: center;
            .left {
                margin-bottom: 60px;
            }
            .right {
                margin-left: 0;
                justify-content: center;
            }
        }
    }
}
</style>
