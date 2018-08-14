<template>
    <layout layout-style="pulled-left">
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
    </layout>
</template>

<script>
import GraphicPreview from './GraphicPreview.vue';
import GraphicDetails from './GraphicDetails.vue';
import PrintForm from './PrintForm.vue';

export default {
    name: 'SingleGraphic',
    data: () => ({
        orderPrint: false,
        loggedIn: false, 
        forSale: true
    }),
    components: {
        GraphicPreview,
        GraphicDetails,
        PrintForm
    }
};
</script>

<style scoped lang="scss"></style>