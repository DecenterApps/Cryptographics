<template>
    <div class="overlay">
        <div class="background"></div>
        <slot/>
    </div>
</template>

<style lang="scss" scoped>
.overlay {
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    transition: opacity .2s ease-in-out;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .background {
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        background-color: fade-out(#000, .3);
    }
    .button-wrapper {
        margin: 0 20px;
        z-index: 1;
        &:first-of-type {
            margin-left: 0;
        }
        &:last-of-type {
            margin-right: 0;
        }
    }
}
</style>

