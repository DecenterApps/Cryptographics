<template>
    <div class="graphic-print">
        <h2 class="large-title">Select your options</h2>
        <div class="info">
            <span>Size — A4 (210 x 197mm)</span>
            <span>Paper  —  Standard Stock (120gsm)</span>
        </div>
        <form @submit.prevent="orderPrint">
            <div class="fieldset labeled-input">
                <label class="label">Quantity</label>
                <cg-input
                  inputType="number"
                  class="number"
                  min="1"
                  v-model="quantity"
                  :inputStyle="!isValidQuantity ? 'error' : null" />
            </div>
            <p v-if="!isValidQuantity" style="color: #BE0000;">Please enter quantity.</p>
            <div class="fieldset">
                <span class="fieldset-title">Contact information</span>
                <cg-input
                  type="email"
                  placeholder="Email"
                  v-model="email"
                  :inputStyle="!isValidEmail ? 'error' : null" />
                <p v-if="!isValidEmail" style="color: #BE0000;">Please enter valid email address.</p>
            </div>
            <div class="fieldset">
                <span class="fieldset-title">Shipping address</span>
                <div class="input-group">
                    <cg-input placeholder="First name" v-model="firstName" />
                    <cg-input placeholder="Last name" v-model="lastName" />
                </div>
                <cg-input placeholder="Street address" v-model="streetAddress" />
                <cg-input placeholder="Apartment, suite, etc. (optional)" v-model="apartment" />
                <cg-input placeholder="City" v-model="city" />
                <div class="input-group">
                    <cg-input placeholder="Country" v-model="country" />
                    <cg-input placeholder="Postal code" v-model="postalCode" />
                </div>
                <cg-input placeholder="Phone" v-model="phone" />
                <p v-if="!areFieldsEmpty" style="color: #BE0000">Please enter valid shipping address informations.</p>
            </div>
            <div class="fieldset">
                <span class="fieldset-title">Shipping method</span>
                <div class="radio-group">
                    <cg-radio
                            name="shipping-method"
                            label="International Standard (5-10 business days)"
                            checked="checked"
                            @change="changeShippingMethod">
                        International Standard (5-10 business days)
                    </cg-radio>
                    <cg-radio
                            name="shipping-method"
                            label="Royal Mail Tracked &amp; Signed"
                            @change="changeShippingMethod">
                        Royal Mail Tracked &amp; Signed
                    </cg-radio>
                    <cg-radio
                            name="shipping-method"
                            label="UPS Saver"
                            @change="changeShippingMethod">
                        UPS Saver
                    </cg-radio>
                </div>
            </div>
            <div class="graphic-controls">
                <cg-button button-style="secondary" @click="$emit('closePrintForm')">Back</cg-button>
                <cg-button type="submit">Order</cg-button>
                <price value="0.05" />
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PrintForm',
  data: () => ({
    graphicId: '',
    quantity: 1,
    email: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    shippingMethod: 'International Standard (5-10 business days)',
    isValidEmail: true,
    isValidQuantity: true,
    areFieldsEmpty: true,
  }),
  props: {
    goBack: {
      type: Function,
      default: () => {},
    }
  },
  created() {
    this.graphicId = this.$route.params.id;
  },
  methods: {
    changeShippingMethod(newValue) {
        this.shippingMethod = newValue;
    },
    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    validateForm() {
      this.isValidEmail = this.validateEmail(this.email);
      this.isValidQuantity = this.quantity !== '' || this.quantity > 0;
      this.areFieldsEmpty = this.firstName !== '' && this.lastName !== '' && this.streetAddress !== '' && this.country !== '' && this.phone !== '' && this.postalCode !== '' && this.phone !== '';
      if (!this.isValidEmail || !this.isValidQuantity || !this.areFieldsEmpty) return false;
      return true
    },
    orderPrint() {
      let isFormValid = this.validateForm();
      if (!isFormValid) return false;
      const data = {
        GraphicId: this.graphicId,
        Quantity: this.quantity,
        Email: this.email,
        FirstName: this.firstName,
        LastName: this.lastName,
        StreetAddress: this.streetAddress,
        Apartment: this.apartment,
        City: this.city,
        Country: this.country,
        PostalCode: this.postalCode,
        Phone: this.phone,
        ShippingMethod: this.shippingMethod
      };
      axios.post('//cryptographics.decenter.com/api/print-form', data, {
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
          }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        })
    }
  }
};
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
        .input-wrapper {
            margin-bottom: 10px;
        }
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
            & .number {
                max-width: 80px;
                text-align: center;
                margin: 0;
                & .input {
                    margin: 0;
                }
            }
        }
    }

    .graphic-controls {
        display: flex;
        .price {
            margin-left: 16px;
        }

        button:first-child {
            margin-right: 20px;
        }
    }
</style>
