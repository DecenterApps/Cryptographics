<template>
        <div class="container">
            <h1>Buttons</h1>
            <div class="section-wrapper">
                <cg-button button-style="primary">Primary</cg-button>
                <cg-button button-style="secondary">Secondary</cg-button>
                <cg-button button-style="tertiary">Tertiary</cg-button>
                <br>
                <br>
                <cg-button button-style="primary" disabled>Primary</cg-button>
                <cg-button button-style="secondary" disabled>Secondary</cg-button>
                <cg-button button-style="tertiary" disabled>Tertiary</cg-button>
                <br>
                <br>
                <cg-button button-style="primary" loading>Primary</cg-button>
                <cg-button button-style="secondary" loading>Secondary</cg-button>
                <cg-button button-style="tertiary" loading>Tertiary</cg-button>
            </div>
            <div class="section-wrapper dark">
                <cg-button button-style="inverted primary">Primary</cg-button>
                <cg-button button-style="inverted secondary">Secondary</cg-button>
                <cg-button button-style="inverted tertiary">Tertiary</cg-button>
                <br>
                <br>
                <cg-button button-style="inverted primary" disabled>Primary</cg-button>
                <cg-button button-style="inverted secondary" disabled>Secondary</cg-button>
                <cg-button button-style="inverted tertiary" disabled>Tertiary</cg-button>
                <br>
                <br>
                <cg-button button-style="inverted primary" loading>Primary</cg-button>
                <cg-button button-style="inverted secondary" loading>Secondary</cg-button>
                <cg-button button-style="inverted tertiary" loading>Tertiary</cg-button>
            </div>
        </div>
</template>

<script>
  export default {
    name: 'UIShowcase',
  };
</script>

<style scoped lang="scss">
    .section-wrapper {
        padding: 20px;
        &.dark {
            background-color: black;
        }
    }
</style>

