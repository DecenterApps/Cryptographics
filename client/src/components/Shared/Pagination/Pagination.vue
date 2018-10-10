<template>
    <div
      :class="['pagination-controls', paginationStyle, showNext === false ? 'last-page' : '']"
      v-if="pages.length > 1"
    >
      <cg-button
        button-style="pagination"
        v-if="showPrev"
        @click="onControls(newPage -= 1)">
        {{ prevText }}
      </cg-button>
      <template v-if="showFirst">
        <span
          @click="onPageClick">
          1
        </span>
        <span class="dots">...</span>
      </template>
      <span
        v-for="(page, index) in pages"
        :key="index"
        @click="onPageClick"
        :class="{ active: page === newPage }">
        {{ page }}
      </span>
      <template v-if="showLast">
        <span class="dots">...</span>
        <span
          @click="onPageClick">
          {{ Math.ceil(total / perPage) }}
        </span>
      </template>
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
      },
      firstText: {
        type: String,
        default: 'First'
      },
      lastText: {
        type: String,
        default: 'Last'
      }
    },
    data() {
      return {
        showPrev: false,
        showNext: false,
        showFirst: false,
        showLast: false,
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
        let showPrev = false;
        let showNext = true;
        let showFirst = false;
        let showLast = pages > 5;

        let pagesArray = [];

        if (pages > 5) {

          pages = 5;
          const breakingPage = Math.ceil(pages / 2);

          if (newPage > breakingPage) {
            for (let i = 1; i <= newPage + 2; i++) {
              pagesArray.push(i);
            }
            if (pagesArray.length < allPages) {
              pagesArray = pagesArray.slice(newPage - breakingPage, newPage + breakingPage);
            } else {
              pagesArray = pagesArray.slice(newPage - pages + (allPages - newPage), newPage + (allPages - newPage));
            }
          } else {
            for (let i = 1; i <= pages; i++) {
              pagesArray.push(i);
            }
          }
          newPage === allPages || newPage >= allPages - 2 ? showLast = false : null;
          newPage > breakingPage ? showFirst = true : null;
          newPage > 1 ? showPrev = true : showPrev = false;
          newPage === allPages ? showNext = false : showNext = true;
        } else {
          for (let i = 1; i <= pages; i++) {
            pagesArray.push(i);
          }
          newPage > 1 ? showPrev = true : showPrev = false;
          newPage === pages ? showNext = false : showNext = true;
        }

        this.showPrev = showPrev;
        this.showNext = showNext;
        this.showFirst = showFirst;
        this.showLast = showLast;

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
        .dots {
          cursor: default;
        }
    }
</style>
