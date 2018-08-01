<template>
    <svg :width="size" :height="size" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L24 24" transform="translate(1 1)" :stroke="color"/>
        <path d="M0 0L24 24" transform="translate(1 25) rotate(-90)" :stroke="color"/>
    </svg>
</template>

<script>
export default {
    name: 'IcoClose',
    props: {
        color: {
            type: String,
            default: 'black'
        },
        size: {
            type: String,
            default: '26px'
        }
    }
}
</script>