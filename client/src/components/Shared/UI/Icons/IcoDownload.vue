<template>
    <svg :width="width" :height="height" viewBox="0 0 44 59" :fill="color" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.70725 28.313C1.31625 27.922 0.684251 27.922 0.293251 28.313C-0.0977493 28.704 -0.0977493 29.336 0.293251 29.727L10.2723 39.706C10.4583 39.895 10.7123 40 10.9783 40C10.9853 40 10.9923 39.996 10.9993 39.996C11.0063 39.996 11.0122 40 11.0203 40C11.3533 40 11.6333 39.827 11.8153 39.577L21.7063 29.686C22.0973 29.295 22.0973 28.663 21.7063 28.272C21.3153 27.881 20.6833 27.881 20.2922 28.272L12.0203 36.544V1C12.0203 0.447 11.5732 0 11.0203 0C10.4673 0 10.0203 0.447 10.0203 1V36.628L1.70725 28.313Z" transform="translate(10.9797)"/>
        <path d="M29 0C28.447 0 28 0.447 28 1C28 1.553 28.447 2 29 2H42V41H2V2H15C15.553 2 16 1.553 16 1C16 0.447 15.553 0 15 0H0V43H44V0H29Z" transform="translate(0 16)"/>
    </svg>
</template>

<script>
export default {
    name: 'IcoDownload',
    props: {
        color: {
            type: String,
            default: 'white'
        },
        width: {
            type: String,
            default: '44px'
        },
        height: {
            type: String,
            default: '59px'
        }
    }
}
</script>
