<template>
    <span class="input-wrapper">
        <input
                class="input"
                :class="[inputStyle, maxLength > 0 ? 'max-length' : '']"
                :type="inputType"
                v-bind="$attrs"
                v-model="content"
                :maxlength="maxLength"
                @input="handleInput">
        <span v-if="maxLength > 0">
            {{ numChars }} / {{ maxLength }}
        </span>
    </span>
</template>

<script>
  export default {
    name: 'Input',
    data() {
      return {
        content: this.value,
        numChars: 0,
      };
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      inputType: {
        type: String,
        default: 'text'
      },
      inputStyle: {
        type: String,
        default: 'input'
      },
      maxLength: {
        type: Number,
        default: null,
      }
    },
    methods: {
      handleInput(e) {
        if (this.maxLength > 0) {
          this.numChars = this.content.length;
          if (this.numChars >= this.maxLength) return;
        }
        this.$emit('input', this.content, e);
      }
    }
  };
</script>

<style scoped lang="scss">
    .input {
        height: 33px;
        box-sizing: border-box;
        outline: 0;
        padding: 9px 13px;
        font-size: 12px;
        background-color: transparent;
        color: #000;
        border: 1px solid #000;
        border-radius: 5px;
        margin-bottom: 10px;
        width: 100%;

        &.max-length {
            padding-right: 50px;
        }

        &.error {
            border: 1px solid #BE0000;
        }
    }

    .input-wrapper {
        position: relative;
        display: inline-block;
        height: 35px;
        span {
            position: absolute;
            right: 10px;
            top: 11px;
            font-size: 12px;
            color: #949494;
        }
    }
</style>

