<template>
    <div class="step-header">
        <div class="container">
            <div class="logo">
                <router-link to="/">
                    <logo fill="#000" />
                </router-link>
            </div>
            <div class="steps">
                <div @click="changeStep(index)" :class="['step', currentStep >= index ? 'active' : '']" v-for="(step, index) in steps">
                    {{ step }}
                    <ico-small-arrow v-if="index !== steps.length - 1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { TOGGLE_MODAL } from 'store/modal/types';
  import Logo from 'shared/UI/Logo.vue';
  import IcoSmallArrow from '../UI/Icons/IcoSmallArrow';

  export default {
    name: 'StepHeader',
    props: {
      steps: {
        default: [],
      },
      currentStep: 0
    },
    components: { IcoSmallArrow, Logo },
    methods: {
      changeStep(step) {
        this.$emit('stepChange', step);
      },
    }
  };
</script>

<style lang="scss" scoped>
    .step-header {
        height: 66px;
        width: 100%;
        background-color: #9e9e9e;
        display: flex;
        align-items: center;
        font-family: Roboto, sans-serif;
        font-size: 14px;
        color: #000000;

        .container {
            display: flex;
        }

        .steps {
            display: flex;
            align-items: center;

            .step {
                display: flex;
                align-items: center;
                margin-right: 25px;
                opacity: 0.3;
                cursor: pointer;

                svg {
                    margin-left: 25px;
                }

                &.active {
                    opacity: 1;
                }
            }
        }

        .logo {
            margin-right: 75px;
        }
    }
</style>
