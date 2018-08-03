<template>
	<div class="pagination-controls">
		<!-- <cg-button button-style="pagination">{{ prevText }}</cg-button> -->
		<span
			v-for="(items, index) in numberOfPages"
			:key="index">{{ index + 1 }}</span>
		<!-- <cg-button button-style="pagination">{{ nextText }}</cg-button> -->
	</div>
</template>

<script>
export default {
	name: 'Pagination',
	props: {
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
	beforeCreate() {
		console.log('CHILD beforeCreate')
	},
	created() {
		console.log('CHILD created')
	},
	beforeMount() {
		console.log('CHILD beforeMount')

	},
	mounted() {
		console.log('CHILD mounted')
	},
	computed: {
		numberOfPages() {
			return this.total / this.perPage
		}
	}
}
</script>

<style lang="scss" scoped>
.pagination-controls {
  text-align: right;
  & span {
    padding: 9px;
    font-size: 12px;
    color: #858585;
    &.active {
      color: #000000;
    }
  }
}
</style>
