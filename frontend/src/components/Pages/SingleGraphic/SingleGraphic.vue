<template>
    <div class="background-wrapper">
        <div class="black-bg"></div>
        <div class="wrapper">
            <div class="container">
                <div class="left">
                    <graphic-preview
                        img-src="/imgurl"
                        name="YoungSerif"
                        address="0xa5fdb57fed1dfa68557e88c3ba3786a9ca8fa518"
                        id="518"
                        year="2018"/>
                </div>
                <div class="right">
                    <graphic-details
                        v-if="!orderPrint"
                        :isLogged="loggedIn"
                        :isForSale="forSale"
                        @showPrintForm="orderPrint = true"
                        name="YoungSerif"
                        address="0xa5fdb57fed1dfa68557e88c3ba3786a9ca8fa518"/>
                    <print-form v-else/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import GraphicPreview from './GraphicPreview.vue';
import GraphicDetails from './GraphicDetails.vue';
import PrintForm from './PrintForm.vue';

export default {
    name: 'SingleGraphic',
    data: () => ({
        orderPrint: false,
        loggedIn: true, 
        forSale: true
    }),
    components: {
        GraphicPreview,
        GraphicDetails,
        PrintForm
    }
};
</script>

<style scoped lang="scss">
.wrapper {
    background-color: #D9D9D9;
    min-height: calc(100vh - 70px);
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
        padding: 40px 0;
        margin-right: 0;
        display: flex;
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