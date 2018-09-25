<template>
        <textarea
                class="textarea"
                :class="[textareaStyle]"
                v-bind="$attrs"
                v-model="content"
                :maxlength="maxLength"
                @input="handleInput"></textarea>
</template>

<script>
  export default {
    name: 'Textarea',
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
      textareaStyle: {
        type: String,
        default: 'textarea'
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
    .textarea {
        box-sizing: border-box;
        outline: 0;
        padding: 9px 13px;
        font-size: 12px;
        background-color: transparent;
        font-family: Roboto, sans-serif;
        color: #000;
        border: 1px solid #000;
        border-radius: 5px;
        margin-bottom: 10px;
        width: 400px;
        height: 100px;

        &.max-length {
            padding-right: 50px;
        }

        &.error {
            border: 1px solid #BE0000;
        }
    }
</style>

