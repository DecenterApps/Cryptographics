<template>
    <layout layout-style="full-screen">
        <div class="graphic-empty-state">
            <div class="error">Error</div>
            <div class="big-num">404</div>
            <div class="message">
                Cryptographic not found.
                <br>
                Would you like to compose a new one?
            </div>
            <button-link to="/create-cryptographic">Compose</button-link>
        </div>
    </layout>
</template>

<script>
  export default {
    name: 'GraphicEmptyState'
  };
</script>

<style scoped lang="scss">

    .graphic-empty-state {
        margin: 140px 0;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        font-family: 'YoungSerif-Regular', serif;
        flex-direction: column;

        .error {
            font-size: 32px;
            margin-bottom: 20px;
        }

        .big-num {
            margin-top: -30px;
            margin-bottom: 40px;
            font-size: 122px;
        }

        .message {
            text-align: center;
            line-height: 35px;
            font-size: 20px;
            margin-bottom: 25px;
        }
    }
</style>