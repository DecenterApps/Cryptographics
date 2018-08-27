<template>
    <div class="graphic-print">
        <h2 class="large-title">Select your options</h2>
        <div class="info">
            <span>Size — A4 (210 x 197mm)</span>
            <span>Paper  —  Standard Stock (120gsm)</span>
        </div>
        <form @submit.prevent="someAction">
            <div class="fieldset labeled-input">
                <label class="label">Quantity</label>
                <cg-input type="text" class="number" value="1"/>
            </div>
            <div class="fieldset">
                <span class="fieldset-title">Contact information</span>
                <cg-input type="email" placeholder="Email"/>
            </div>
            <div class="fieldset">
                <span class="fieldset-title">Shipping address</span>
                <div class="input-group">
                    <cg-input placeholder="First name"/>
                    <cg-input placeholder="Last name"/>
                </div>
                <cg-input placeholder="Street address"/>
                <cg-input placeholder="Apartment, suite, etc. (optional)"/>
                <cg-input placeholder="City"/>
                <div class="input-group">
                    <cg-input placeholder="Country"/>
                    <cg-input placeholder="Postal code"/>
                </div>
                <cg-input placeholder="Phone"/>
            </div>
            <div class="fieldset">
                <span class="fieldset-title">Shipping method</span>
                <div class="radio-group">
                    <cg-radio
                        name="shipping-method"
                        value="international"
                        checked="checked">
                        International Standard (5-10 business days)
                    </cg-radio>
                    <cg-radio 
                        name="shipping-method"
                        value="royal">
                        Royal Mail Tracked &amp; Signed
                    </cg-radio>
                    <cg-radio
                        name="shipping-method"
                        value="ups">
                        UPS Saver
                    </cg-radio>
                </div>
            </div>
            <div class="graphic-controls">
                <cg-button type="submit">Order</cg-button>
                <price
                    value="0.05"/>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
.graphic-print {
    width: 100%;
    max-width: 370px;
    .info {
        margin-bottom: 17px;
        span {
            display: block;
            font-size: 12px;
            margin-bottom: 4px;
        }
    }
}
.fieldset {
    display: flex;
    flex-direction: column;
    margin-bottom: 17px;
    .fieldset-title {
    color: #949494;
    font-size: 12px;
    margin-bottom: 6px;
    display: block
    }
    &.labeled-input {
        flex-direction: row;
        align-items: center;
        & .label {
            margin-right: 13px;
        }
        & .input {
            margin-bottom: 0;
            &.number {
                max-width: 40px;
                text-align: center;
                padding: 9px 0;
            }
        }
    }
}
.graphic-controls {
    display: flex;
    .price {
        margin-left: 16px;
    }
}
</style>
