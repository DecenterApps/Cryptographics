<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path
                d="M1 1L17 17L1 33"
                :stroke="color"
        />
    </svg>
</template>

<script>
  export default {
    name: 'IcoArrow',
    props: {
      color: {
        type: String,
        default: '#d9d9d9'
      },
      width: {
        type: String,
        default: '18'
      },
      height: {
        type: String,
        default: '34'
      }
    }
  };
</script>
