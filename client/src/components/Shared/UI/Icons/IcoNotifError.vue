<template>
    <svg class="ico-notif-error" width="30" height="30" viewBox="0 0 30 30" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="15" :fill="icoColor" />
        <path d="M10 20L19.5 11" :stroke="icoStroke" stroke-width="2" />
        <path d="M10.25 10.75L19.25 20.25" :stroke="icoStroke" stroke-width="2" />
    </svg>

</template>

<script>
  export default {
    name: 'IcoNotifError',
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
