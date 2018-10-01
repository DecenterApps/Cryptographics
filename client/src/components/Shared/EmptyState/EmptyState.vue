<template>
    <div class="empty-state">
        <div v-if="type === 'gallery-all'">There are no Cryptographics created yet.</div>
        <div v-if="type === 'gallery-sale'">There are no Cryptographics for sale yet.</div>

        <div v-if="type === 'profile-gallery-all-own'">You don't own any Cryptographics yet.</div>
        <div v-if="type === 'profile-gallery-all'">This user doesn't own any Cryptographics yet.</div>

        <div v-if="type === 'profile-gallery-created-own'">
            You haven't created any Cryptographics yet. <router-link to="/create-cryptographic">Start creating!</router-link>
        </div>
        <div v-if="type === 'profile-gallery-created'">This hasn't created any Cryptographics yet.</div>

        <div v-if="type === 'profile-gallery-bought-own'">
            You haven't bought any Cryptographics yet. Check some out in the <router-link to="/gallery">gallery</router-link>.
        </div>
        <div v-if="type === 'profile-gallery-bought'">This user hasn't bought any Cryptographics yet.</div>

        <div v-if="type === 'profile-asset-packs-all-own'">You don't own any asset packs yet.</div>
        <div v-if="type === 'profile-asset-packs-all'">This user doesn't own any asset packs yet.</div>
        <div v-if="type === 'profile-asset-packs-bought-own'">
            You haven't bought any asset packs yet. Take a look at the <router-link to="/asset-packs">market</router-link>.
        </div>
        <div v-if="type === 'profile-asset-packs-bought'">This user hasn't bought any asset packs yet. </div>
        <div v-if="type === 'profile-asset-packs-created-own' || type === 'asset-packs-created'">
            You haven't created any asset packs yet. <router-link to="/create-asset-pack">Create one now!</router-link>
        </div>
        <div v-if="type === 'profile-asset-packs-created'">This user hasn't created any asset packs yet.</div>

        <div v-if="type === 'asset-packs-all'">There are no asset packs created yet.</div>
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
        font-size: 20px;
        line-height: 52px;
        font-family: 'YoungSerif-Regular', serif;

        a {
            text-decoration: underline;
            color: black;
            transition: opacity .2s ease-in-out;

            &:hover {
                opacity: 0.7;
            }
        }
    }
</style>