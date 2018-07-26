<template>
    <svg :width="size" :height="size" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="17.9167" cy="17.9167" r="16.9167" :stroke="color" stroke-width="2"/>
        <path d="M0 0L13 13" transform="translate(30 30)" :stroke="color" stroke-width="2"/>
    </svg>
</template>

<script>
export default {
    name: 'IcoMagnifier',
    props: {
        color: {
            type: String,
            default: 'white'
        },
        size: {
            type: String,
            default: '44px'
        }
    }
}
</script>