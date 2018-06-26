<template>
    <div>
        <label> Cao </label>
    </div>
</template>

<script>

    import functions from '../../scripts/functions.js';

    export default {
        data:  () => ({
        }),
        props : ["metamask_account"],
        watch: {
            'metamask_account': async (metamaskAccount) => {
                console.log(metamaskAccount);
                let my_images_on_chain = await functions.getUserImages(metamaskAccount);
                let prefix = "https://ipfs.decenter.com/ipfs/";
                let images = [];
                for(let i=0 ; i<my_images_on_chain.length; i++) {
                    let hash = await functions.getImageIpfs(my_images_on_chain[i]);
                    images.push(prefix+hash);
                }
                console.log(images);
            }
        },

    }
</script>

<style scoped>

</style>