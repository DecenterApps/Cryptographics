<template>
    <div :class="['pagination-controls', paginationStyle, showNext === false ? 'last-page' : '']" v-if="pages.length > 1">
        <cg-button
                button-style="pagination"
                v-if="showPrev"
                @click="onControls(newPage -= 1)">
            {{ prevText }}
        </cg-button>
        <span
                v-for="(page, index) in pages"
                :key="index"
                @click="onPageClick"
                :class="{ active: page === newPage }">
			{{ page }}
		</span>
        <cg-button
                button-style="pagination"
                v-if="showNext"
                @click="onControls(newPage += 1)">
            {{ nextText }}
        </cg-button>
    </div>
</template>

<script>
  export default {
    name: 'Pagination',
    props: {
      paginationStyle: {
        type: String,
        default: '',
      },
      total: {
        type: Number,
        required: true
      },
      perPage: {
        type: Number,
        default: 2
      },
      prevText: {
        type: String,
        default: 'Prev'
      },
      nextText: {
        type: String,
        default: 'Next'
      }
    },
    data() {
      return {
        showNext: false,
        showPrev: false,
        newPage: 1
      };
    },
    methods: {
      onPageClick(event) {
        this.newPage = Number(event.target.textContent);
        this.$emit('updatePage', this.newPage);
      },
      onControls(value) {
        this.$emit('updatePage', value);
      }
    },
    computed: {
      pages() {
        const total = this.total;
        const perPage = this.perPage;
        let pages = Math.ceil(total / perPage);
        const allPages = pages;
        const newPage = Number(this.newPage);
        let showNext = true;
        let showPrev = false;

        let pagesArray = [];

        if (pages > 5) {

          pages = 5;

          if (newPage > pages) {
            for (let i = 1; i <= newPage; i++) {
              pagesArray.push(i);
            }
            pagesArray = pagesArray.slice(newPage - pages, newPage);
          } else {
            for (let i = 1; i <= pages; i++) {
              pagesArray.push(i);
            }
          }

          newPage > 1 ? showPrev = true : showPrev = false;
          newPage === allPages ? showNext = false : showNext = true;
        } else {
          for (let i = 1; i <= pages; i++) {
            pagesArray.push(i);
          }
          newPage > 1 ? showPrev = true : showPrev = false;
          newPage === pages ? showNext = false : showNext = true;
        }

        this.showNext = showNext;
        this.showPrev = showPrev;

        return pagesArray;
      },
    }
  };
</script>

<style lang="scss" scoped>
    .pagination-controls {
        text-align: right;
        & span {
            padding: 9px;
            font-size: 12px;
            color: #858585;
            cursor: pointer;
            &.active {
                color: #000000;
            }
        }

        &.last-page {
            margin-right: 50px;
        }

        &.left {
            text-align: left;
        }
    }
</style>
