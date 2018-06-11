<template>
    <div>
        <button v-for="assetPack in assetPacks">
        {{ assetPack }}</button>
    </div>
</template>

<script>
    export default {
        data: () => ({
            assetPacks: [],
        }),
        props: ["allAssets"],
        methods: {

        },
        render() {
            console.log(props);
            let i,j;
            let chunk = 10;
            for(i=0, j=allAssets.length; i<j; i+=chunk){
                this.assetPacks.push(self.allAssets.slice(i,i+chunk));
            }
        },

        computed : {

        }

    }
</script>

<style scoped>

</style>