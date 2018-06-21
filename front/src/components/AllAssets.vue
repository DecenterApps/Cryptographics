<template>
    <div>
        <div v-for="(asset,key) in allAssetPaths">
            <label> {{key}}</label>
            <img :src=asset>
        </div>
    </div>
</template>

<script>
    export default {

        data: () => ({
            allAssetPaths: [],
        }),

        async created(){
            let assetDir = "http://localhost:3000/dist/assets/";
            let len = 50;
            let images =[];
            for(let i=1; i<len; i++){
                if(i<10){
                    let image = assetDir+"0"+i.toString()+".png";
                    images.push(image);
                } else {
                    let image = assetDir+i.toString()+".png";
                    images.push(image);
                }
            }
            this.allAssetPaths = images;

        },
        computed: {

        },
        methods: {

        },
        render() {

        },
    }
</script>

<style scoped>
    img{
        margin-right: 100px;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 150px;
        height: 150px;
    }


    div{
        display: inline-block;
    }

</style>