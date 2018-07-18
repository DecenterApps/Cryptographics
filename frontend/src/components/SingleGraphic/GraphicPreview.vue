<template>
    <div class="graphic-preview">
        <img
            class="image"
            src="./assets/artwork.png"> <!-- zameni sa imgSrc -->
        <div class="details">
            <img class="cg-stamp" src="./assets/cg-stamp-big.png">
            <div class="title">
                <span class="name">{{ name }}</span>
                <span class="address">{{ address }}</span>
            </div>
            <div class="stamp">
                <span class="id">{{ id }}</span>
                <img class="border" src="./assets/stamp.png">
                <span class="year">{{ year }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Graphic',
    props: {
        imgSrc: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        },
        year: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped lang="scss">
.graphic-preview {
    position: relative;
    margin: 0;
    padding: 16px 16px 0 16px;
    background-color: #ffffff;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    .details {
        width: 100%;
        padding: 10px 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .title {
            text-align: center;
            .name {
                font-size: 6px;
                font-family: 'YoungSerif-Regular', serif;
                display: block;
            }
            .address {
                font-size: 4px;
                display: block;
            } 
        }
        .stamp {
            position: relative;
            display: inline-flex;
            transform: rotate(-11deg);
            .id {
                font-family: 'YoungSerif-Regular', serif;
                color: #FF3D00;
                font-size: 7px;
                position: absolute;
                top: 33%;
                left: 50%;
                transform: translateX(-50%);
            }
            .year {
                font-size: 4px;
                position: absolute;
                bottom: 33%;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }
}
</style>

