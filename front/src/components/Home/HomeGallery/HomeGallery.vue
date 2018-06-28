<template>
    <div class="home-gallery">
        <div class="container">
            <div class="filters">
                <div class="filter-group">
                    <span class="active">High</span>
                    <span>Low</span>
                    <span>Recent</span>
                </div>
                <div class="filter-group">
                    <span class="active">All</span>
                    <span>Select Asset Pack</span>
                </div>
            </div>
            <div class="masonry-wrapper" v-masonry transition-duration="0.3s" item-selector=".item"
                 gutter=".gutter-sizer" fit-width="true">
                <div class="grid">
                    <div class="gutter-sizer"></div>
                </div>
                <div v-masonry-tile class="item" v-for="(item, index) in blocks">
                    <div class="artwork">
                        <img v-bind:class="item.className" v-bind:src="item.src" alt="">
                        <div>
                            <p class="artwork-description"><b>Digital Print: </b> {{item.address}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'home-gallery',
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

<style scoped lang="scss">
    .home-gallery {
        background-color: #F9F9F9;

        .masonry-wrapper {
            margin: 0 auto;
        }
        .gutter-sizer {
            width: 70px;
        }

        .filters {
            padding: 30px 0 70px 0;
            font-size: 12px;
            display: flex;
            justify-content: space-between;

            span {
                margin-right: 14px;

                &.active {
                    text-decoration: underline;
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        .item {
            width: 307px;
            margin-bottom: 30px;

            .artwork {
                padding: 14px 14px 40px 14px;
                background-color: #fff;

                .artwork-description {
                    font-size: 5px;
                }
            }
        }
    }
</style>