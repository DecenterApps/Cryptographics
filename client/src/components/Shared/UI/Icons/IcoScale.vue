<template>
    <svg :width="size" :height="size" :viewBox="`0 0 ${size.slice(0, -2)} ${size.slice(0, -2)}`" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="4.25" :stroke="color" stroke-width="1.5" />
        <path d="M22.4004 5.59991L12.1337 15.8666M12.1337 15.8666L12.1337 7.31102M12.1337 15.8666L20.1189 15.8666"
              :stroke="color" stroke-width="1.5" />
    </svg>
</template>

<script>
  export default {
    name: 'IcoScale',
    props: {
      color: {
        type: String,
        default: '#fff',
      },
      size: {
        type: String,
        default: '28px',
      }
    }
  };
</script>
