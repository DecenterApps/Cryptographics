<template>
    <svg class="ico-success" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="15" :fill="icoColor" />
        <path d="M10 14.8421L13.4483 18L20 12" :stroke="icoStroke" stroke-width="2" />
    </svg>
</template>

<script>
  export default {
    name: 'IcoSuccess',
    props: {
      icoColor: {
        type: String,
        default: '#fff'
      },
      icoStroke: {
        type: String,
        default: '#000'
      }
    }
  };
</script>
