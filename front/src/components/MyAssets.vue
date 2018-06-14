<template>
    <div>
        <img v-for="asset in my_bought_assets" :src="asset"/>
    </div>
</template>

<script>
    export default {

        name: "my-assets",
        data: () => ({
            my_bought_assets : [],
        }),

        props: ["bought_assets"],
        methods: {

        },
        render() {

        },

        watch: {
            'bought_assets': (newObjs) => {
                console.log(this.my_bought_assets);
                console.log(newObjs);
                for(let i=0; i<newObjs.length; i++){
                    let number = newObjs[i];

                    if(parseInt(number,10) < 10) {
                        number = "0"+number.toString();
                    }
                    let str = '../dist/assets/' + number + '.png';
                    this.my_bought_assets.push(str);
                }
            }
        }
    }
</script>

<style scoped>

</style>