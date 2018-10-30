<template>
    <div class="notifications">
        <div class="notification" v-for="notification, index in notifications">
            <ico-success v-if="notification.status === 'success'"></ico-success>
            <ico-notif-error v-if="notification.status === 'error'"></ico-notif-error>
            <loader v-if="notification.status === 'loading'" loader-style="white" />
            <span v-html="notification.message"></span>
            <ico-close @click.native="removeNotif(index)" size="12px" color="#fff"></ico-close>
        </div>
    </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { HIDE_LOADING_MODAL, LOADING_CONTENT } from 'store/modal/types';
  import { NOTIFICATIONS, REMOVE_NOTIFICATION } from 'store/user-config/types';
  import IcoSuccess from '../UI/Icons/IcoSuccess';
  import IcoClose from '../UI/Icons/IcoClose';
  import IcoNotifError from '../UI/Icons/IcoNotifError';

  export default {
    name: 'Notifications',
    data: () => ({}),
    components: { IcoNotifError, IcoClose, IcoSuccess },
    computed: {
      ...mapGetters({
        notifications: NOTIFICATIONS
      }),
    },
    methods: {
      ...mapActions({
        removeNotif: REMOVE_NOTIFICATION
      }),
    }
  };
</script>

<style lang="scss" scoped>
    .notifications {
        position: fixed;
        top: 90px;
        right: 10px;
        animation: pop-up 0.5s ease-in-out;
        z-index: 10000;
        .loader-content, svg:first-child {
            margin-right: 15px;
            flex-basis: 45px
        }

        .notification {
            position: relative;
            display: flex;
            align-items: center;
            font-family: Roboto, serif;
            font-weight: 300;
            line-height: 19px;
            font-size: 15px;
            max-width: 295px;
            background-color: #000;
            border-radius: 5px;
            min-height: 75px;
            padding: 20px;
            box-sizing: border-box;
            color: #fff;
            margin-bottom: 15px;

            .ico-close {
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
            }
        }
    }

    @keyframes pop-up {
        0% {
            -webkit-transform: translate(0, -200px);
            transform: translate(0, -200px);
        }
        70% {
            -webkit-transform: translate(0, 20px);
            transform: translate(0, 20px);
        }
        90% {
            -webkit-transform: translate(0, -10px);
            transform: translate(0, -10px);
        }
        100% {
            -webkit-transform: translate(0, 0);
            transform: translate(0, 0);
        }
    }
</style>
