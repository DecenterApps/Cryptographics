<template>
    <div>
        <slider-gallery/>
        <gallery :images="blocks"/>
    </div>
</template>

<script>
  import Gallery from '../../Shared/Gallery/Gallery.vue';

  export default {
    name: 'about',
    components: {
      Gallery
    },

      methods : {
        renderCanvas() {
            let canvas = document.getElementById('canvas');
            canvas.width = 350;
            canvas.height = 350;

            let images_paths = [];
            let numberOfImages = Math.floor(Math.random() * 20);
            for(let i=0; i<numberOfImages; i++) {
                let val = Math.floor(Math.random()*30);
                if(val == 0) {
                    val = 1;
                }
                let path = val < 10 ? "0" + val.toString() : val.toString();
                images_paths.push(path);
            }
            makeCoverImage(true, images_paths, canvas, 350,350);
        }
      },
    data: () => ({
      blocks: [
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/wide.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/wide.png'),
        },
        {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/wide.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/long.png'),
        }, {
          address: '0x00158a74921620b39e5c3afe4dca79feb2c2c143',
          name: 'The point of',
          price: 0.45,
          src: require('./assets/wide.png'),
        },
      ],
    }),

  };
</script>

<style scoped>
    canvas {
        margin-top: 20px;
        background-color: white;
        border: 1px solid blue;
        margin-left: 400px;
        width:350px;
        height: 350px;
    }


</style>