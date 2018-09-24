<template>
    <div class="empty-state">
        <div v-if="type === 'all'">There are no Cryptographics created at the moment.</div>
        <div v-if="type === 'sale'">There are no Cryptographics for sale at the moment.</div>
    </div>
</template>

<script>
  export default {
    name: 'EmptyState',
    props: {
      type: {
        type: String,
      }
    },
  };
</script>

<style scoped>
    .empty-state {
        margin: 20px 0;
        font-size: 32px;
        line-height: 52px;
        font-family: 'YoungSerif-Regular', serif;
    }
</style>