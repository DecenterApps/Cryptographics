<template>
    <svg class="ico-background" width="32" height="31" viewBox="0 0 32 31" :fill="icoColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.3772 12.2838L32 9.07516L16.0003 0L0 9.07516L5.62284 12.2838L0 15.4727L5.62284 18.6813L0 21.8702L16.0003 31L32 21.8702L26.3772 18.6813L32 15.4727L26.3772 12.2838ZM16.0003 1.33766L29.6469 9.07806L16.0003 16.8656L2.35314 9.07806L16.0003 1.33766ZM6.79854 12.9544L16.0003 18.205L25.202 12.9544L29.6469 15.4756L16.0003 23.2631L2.35314 15.4756L6.79854 12.9544ZM29.6469 21.8731L16.0003 29.6606L2.35314 21.8731L6.79854 19.3519L16.0003 24.6025L25.202 19.3519L29.6469 21.8731Z"/>
        <path d="M0 3.5L5.5 0L15 5.5L24.5 0.5L29.5 3.5L15 12L0 3.5Z" transform="translate(1 18.5)"/>
    </svg>
</template>

<script>
  export default {
    name: 'IcoBackground',
    props: {
      icoColor: {
        type: String,
        default: '#fff'
      }
    }
  };
</script>
