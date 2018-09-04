<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44.881 1L58 14M58 14L44.881 27M58 14H0" :stroke="color"/>
    </svg>
</template>

<script>
  export default {
    name: 'IcoArrowLong',
    props: {
      color: {
        type: String,
        default: '#000'
      },
      width: {
        type: String,
        default: '59'
      },
      height: {
        type: String,
        default: '28'
      }
    }
  };
</script>
