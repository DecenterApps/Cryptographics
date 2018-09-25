<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L8.5 8.5L1 16" :stroke="color" />
    </svg>
</template>

<script>
  export default {
    name: 'IcoSmallArrow',
    props: {
      color: {
        type: String,
        default: '#000'
      },
      width: {
        type: String,
        default: '10'
      },
      height: {
        type: String,
        default: '17'
      }
    }
  };
</script>
