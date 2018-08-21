<template>
    <svg :width="width" :height="height" :viewBox="`0 0 ${width.slice(0,-2)} ${height.slice(0,-2)}`" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
                y="12.1108"
                width="18.8889"
                height="18.8889"
                rx="5"
                :fill="color"
        />
        <path
                d="M25.0298 18.5311L25.0298 11.0302C25.0298 8.26873 22.7912 6.03016 20.0298 6.03016L13.7643 6.03016M25.0298 18.5311L21.4064 14.9077M25.0298 18.5311L28.4116 15.1493"
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
        default: '32px',
      },
      height: {
        type: String,
        default: '31px',
      }
    }
  };
</script>
