<template>
    <div class="empty-state">
        <div v-if="type === 'gallery-all'">There are no Cryptographics created at the moment.</div>
        <div v-if="type === 'gallery-sale'">There are no Cryptographics for sale at the moment.</div>

        <div v-if="type === 'profile-gallery'">You don't own any Cryptographics at the moment.</div>

        <div v-if="type === 'profile-asset-packs-all'">You don't own any Asset packs at the moment.</div>
        <div v-if="type === 'profile-asset-packs-bought'">
            You haven't bought any asset packs yet. Go to <router-link to="/asset-packs">market</router-link>.
        </div>
        <div v-if="type === 'profile-asset-packs-created' || type === 'asset-packs-created'">
            You haven't created any Asset packs yet.
        </div>

        <div v-if="type === 'asset-packs-all'">There are no Asset packs created at the moment.</div>
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

<style scoped lang="scss">
    .empty-state {
        margin: 20px 0;
        font-size: 32px;
        line-height: 52px;
        font-family: 'YoungSerif-Regular', serif;

        a {
            text-decoration: none;
            color: black;
            transition: opacity .2s ease-in-out;

            &:hover {
                opacity: 0.7;
            }
        }
    }
</style>