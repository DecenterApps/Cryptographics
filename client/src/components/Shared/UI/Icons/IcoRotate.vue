<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" :width="width - 2" :height="height - 2" rx="4" :stroke="color" stroke-width="2" />
        <path
                d="M19.8833 19.1338L19.8833 11.6328C19.8833 8.87139 17.6447 6.63282 14.8833 6.63282L8.61778 6.63282M19.8833 19.1338L16.2599 15.5104M19.8833 19.1338L23.2652 15.7519"
                :stroke="color"
                stroke-width="1.5"
        />
    </svg>
</template>

<script>
  export default {
    name: 'IcoRotate',
    props: {
      color: {
        type: String,
        default: '#fff',
      },
      width: {
        type: String,
        default: '28',
      },
      height: {
        type: String,
        default: '28',
      }
    }
  };
</script>
