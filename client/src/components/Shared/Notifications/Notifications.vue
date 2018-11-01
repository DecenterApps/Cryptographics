<template>
    <div class="notifications">
        <div class="notification" v-for="notification, index in notifications" :key="notification.time">
            <router-link v-if="notification.linkTo" :to="notification.linkTo"
                         class="content-wrapper" @click.native="removeNotif(index)">
                <div class="status-icon">
                    <ico-success v-if="notification.status === 'success'" ico-stroke="white" ico-color="#219653"></ico-success>
                    <ico-notif-error v-if="notification.status === 'error'" ico-stroke="white" ico-color="#EB5757"></ico-notif-error>
                    <loader v-if="notification.status === 'loading'" loader-style="white double-width" />
                </div>
                <span>{{notification.message}}</span>
            </router-link>
            <div v-else class="content-wrapper">
                <div class="status-icon">
                    <ico-success v-if="notification.status === 'success'" ico-stroke="white" ico-color="#219653"></ico-success>
                    <ico-notif-error v-if="notification.status === 'error'" ico-stroke="white" ico-color="#EB5757"></ico-notif-error>
                    <loader v-if="notification.status === 'loading'" loader-style="white double-width" />
                </div>
                <span>{{notification.message}}</span>
            </div>
            <div class="close-wrapper" @click="removeNotif(index)">
                <ico-close size="28px" color="#fff"></ico-close>
            </div>
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
        top: 70px;
        right: 0;
        padding: 15px 15px 0 0;
        z-index: 10000;
        overflow: auto;
        height: calc(100vh - 90px);
        pointer-events: none;

        .notification {
            position: relative;
            display: flex;
            font-family: Roboto, serif;
            font-weight: 300;
            line-height: 19px;
            font-size: 15px;
            max-width: 400px;
            background-color: #000;
            border-radius: 5px;
            min-height: 75px;
            box-sizing: border-box;
            color: #fff;
            margin-bottom: 15px;
            overflow: hidden;
            animation: pop-up 0.5s ease-out;
            pointer-events: all;

            .status-icon {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-right: 15px;
                > * {
                    flex: 0 0 30px;
                }
            }

            .content-wrapper {
                display: flex;
                color: white;
                padding: 20px;
            }


            .close-wrapper {
                min-width: 74px;
                background-color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all .2s;
                stroke-width: 2;

                &:hover {
                    background-color: #444;
                }
            }
        }
    }

    @keyframes pop-up {
        0% {
            transform: translate(100%, 0);
        }
        100% {
            transform: translate(0, 0);
        }
    }
</style>
