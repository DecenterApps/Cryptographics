<template>
    <label class="checkbox">
        <input
            type="checkbox"
            :name="name"
            :value="value"
            v-bind="$attrs">
        <span class="label"><slot/></span>
    </label>
</template>

<script>
export default {
    name: 'Radio',
    props: {
        name: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        }
    }
}
</script>

<style scoped lang="scss">
.label {
  font-size: 12px;
  color: #000;
}
.checkbox {
  display: block;
  margin-bottom: 8px;
  cursor: pointer;
  input {
    display: none;
    &:checked {
      & + .label:before {
        background-color: #000;
      }
    }
  }
  .label {
    font-size: 12px;
    &:before {
      content: "";
      position: relative;
      bottom: -2px;
      display: inline-flex;
      width: 15px;
      height: 15px;
      border: 1px solid #000;
      border-radius: 5px;
      margin-right: 8px;
      background-color: transparent;
      transition: background-color .2s ease-in-out;
    }
  }
}
</style>

