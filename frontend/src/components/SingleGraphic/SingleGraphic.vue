<template>
    <div class="background-wrapper">
        <div class="black-bg"></div>
        <div class="wrapper">
            <div class="container">
                <div class="left">
                    <div class="artwork-wrapper">
                        <img class="artwork" src="./assets/artwork.png">
                        <div class="details">

                            <img class="cg-stamp" src="./assets/cg-stamp-big.png">
                            <div class="title">
                                <span class="name">Young Serif Young</span>
                                <span class="address">0xa5fdb57fed1dfa68557e88c3ba3786a9ca8fa518</span>
                            </div>
                            <div class="stamp">
                                <span class="id">518</span>
                                <img class="border" src="./assets/stamp.png">
                                <span class="year">2018</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <!-- <div class="artwork-details">
                        <div class="assets">
                            <div class="asset-pack">
                                <span class="asset">03</span>
                                <span class="asset">01</span>
                                <span class="asset">05</span>
                                <span class="asset">05</span>
                                <span class="asset">05</span>
                            </div>
                            <p>Assets pack used in this Cryptographic</p>
                        </div>
                        <div class="artwork-meta">
                            <div class="artwork-name">
                                <h3 class="large-title">Young Serif</h3>
                                <a href="" class="author">
                                    <img class="avatar" src="" alt="">
                                    <span class="username">@username</span>
                                </a>
                            </div>

                            <div class="artwork-address">
                                <strong>cryptographics address:</strong>
                                <span class="address">0xa5fdb57fed1dfa68557e88c3ba3786a9ca8fa518</span>
                            </div>

                            <div class="artwork-controls">
                                <router-link tag="button" to="/gallery" class="default-button button-negative">My Gallery</router-link>
                                <button class="default-button button-negative">Sell</button>
                                <button class="default-button button-negative">Print</button>
                            </div>

                            <div class="artwork-controls">
                                <button class="default-button button-negative">Buy</button>
                                <span class="price">2.05</span>
                            </div>

                            <div class="artwork-controls sell">
                                <input class="default-input" type="text" placeholder="value">
                                <div class="button-group">
                                    <button class="default-button no-background">Cancel</button>
                                    <button class="default-button button-negative">Buy</button>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <div class="artwork-print">
                        <h2 class="large-title">Select your options</h2>
                        <div class="printing-info">
                            <span>Size — A4 (210 x 197mm)</span>
                            <span>Paper  —  Standard Stock (120gsm)</span>
                        </div>
                        

                        
                        <form>
                            <div class="fieldset">
                                <span class="label">Quantity</span>
                                <input class="default-input" type="number" value="1">
                            </div>

                            <div class="fieldset">
                                <span class="fieldset-title">Contact information</span>
                                <input class="default-input"  type="email" placeholder="email">
                            </div>

                            <div class="fieldset">
                                <span class="fieldset-title">Shipping address</span>
                                <div class="input-group">
                                    <input class="default-input"  type="text" placeholder="First name">
                                    <input class="default-input"  type="text" placeholder="Last name">
                                </div>
                                <input class="default-input"  type="text" placeholder="Address">
                                <input class="default-input"  type="text" placeholder="Apartment, suite, etc. (optional)">
                                <input class="default-input"  type="text" placeholder="City">
                                <div class="input-group">
                                    <input class="default-input"  type="text" placeholder="Country">
                                    <input class="default-input"  type="text" placeholder="Postal code ">
                                </div>
                                <input class="default-input"  type="text" placeholder="Phone">
                            </div>
                            <div class="fieldset">
                                <span class="fieldset-title">Shipping method</span>
                                <div class="radio-group">
                                    <label class="radio-input">
                                        <input type="radio" name="shipping-method">
                                        <span class="label">International Standard (5-10 business days)</span>
                                    </label>
                                    <label class="radio-input">
                                        <input type="radio"  name="shipping-method">
                                        <span class="label">Royal Mail Tracked &amp; Signed</span>
                                    </label>
                                    <label class="radio-input">
                                        <input type="radio"  name="shipping-method" checked>
                                        <span class="label">UPS Saver</span>
                                    </label>
                                </div>
                            </div>

                            <div class="artwork-controls">
                                <button class="default-button button-negative">Order</button>
                                <span class="price">2.05</span>
                            </div>
                            
                        </form>

                    </div>

                    
                </div>
                




            </div>
        </div>
    </div>
</template>

<script>
    import PageFooter from '../Footer/Footer.vue';

    export default {
    name: 'Landing',
    components: {
        PageFooter
    }
  };
</script>

<style scoped lang="scss">
.wrapper {
    background-color: #D9D9D9;
    min-height: calc(100vh - 70px);
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    position: relative;
    &:before {
        content: "";
        background-color: #D9D9D9;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -100%;
        width: 100%;
    }
    .container {
        padding: 40px 0;
        margin-right: 0;
        display: flex;
        .right {
            margin-left: 50px;
            width: 100%;
        }
    }
    @media all and (max-width: 1280px) {
        width: 100%;
        left: 0;
        .container {
            margin-right: auto;
        }
    }
}
.artwork-wrapper {
    position: relative;
    margin: 0;
    padding: 16px 16px 0 16px;
    background-color: #ffffff;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    .details {
        width: 100%;
        padding: 10px 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .title {
            text-align: center;
            .name {
                font-size: 6px;
                font-family: 'YoungSerif-Regular', serif;
                display: block;
            }
            .address {
                font-size: 4px;
                display: block;
            } 
        }
        .stamp {
            position: relative;
            display: inline-flex;
            transform: rotate(-11deg);
            .id {
                font-family: 'YoungSerif-Regular', serif;
                color: #FF3D00;
                font-size: 7px;
                position: absolute;
                top: 33%;
                left: 50%;
                transform: translateX(-50%);
            }
            .year {
                font-size: 4px;
                position: absolute;
                bottom: 33%;
                left: 50%;
                transform: translateX(-50%);
            }
        }

    }
}

.artwork-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.asset-pack {
    margin-bottom: 13px;
    .asset {
        display: inline-flex;
        height: 33px;
        width: 33px;
        margin: 0 5px;
        font-size: 12px;
        background-color: #494946;
        color: #fff;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        &:first-of-type {
            margin-left: 0;
        }
    }    
}



.artwork-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.artwork-name {
    margin-bottom: 50px;
    .large-title {
        margin-bottom: 10px;
    }
    .author {
        display: flex;
        align-items: center;
        text-decoration: none;
        .avatar {
            display: inline-flex;
            background-color: #555;
            border-radius: 50%;
            width: 33px;
            height: 33px;
            margin-right: 10px;
        }
        .username {
            color: #858585;
            font-size: 12px;
        }
    }
}
.artwork-address {
    font-size: 12px;
    strong {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
    }
    .address {
        color: #1F34F7;
        display: block;
    }
}

.artwork-controls {
    margin-top: 18px;
    display: flex;
    flex-wrap: wrap;
    &.sell {
        flex-direction: column;
    }
    .default-button {
        margin: 0 10px;
        &:first-of-type {
            margin-left: 0;
        }
        &:last-of-type {
            margin-right: 0;
        }
    }
    .price {
        font-family: 'YoungSerif-Regular', serif;
        font-size: 32px;
        margin-left: 16px;
        &:after {
            content: "";
            width: 12px;
            height: 14px;
            margin-left: 8px;
            display: inline-flex;
            background-image: url(./assets/ico-eth-currency.png);
        }
    }
    .default-input {
        width: 100%;
        margin-bottom: 10px;
    }
}

.artwork-print {
    width: 100%;
    max-width: 370px;
}

.printing-info {
    margin-bottom: 17px;
    span {
        display: block;
        font-size: 12px;
        margin-bottom: 4px;
    }
}
</style>