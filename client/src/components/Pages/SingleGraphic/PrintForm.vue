<template>
    <div class="graphic-print">
        <h2 v-if="!isSuccess" class="large-title">Select your options</h2>
        <p v-if="isSuccess" class="form-success">You have successfully ordered your print. We'll contact you soon.</p>
        <p>At the moment we process all print orders manually and we'll get back to you via email with payment and shipping details.</p>
        <div v-if="!isSuccess"  class="info">
            <span>Size — A4 (210 x 197mm)</span>
            <span>Paper  —  Standard Stock (120gsm)</span>
        </div>
        <form @submit.prevent="orderPrint">
            <div v-if="!isSuccess" class="fieldset labeled-input">
                <label class="label">Quantity</label>
                <cg-input
                  inputType="number"
                  class="number"
                  min="1"
                  v-model="quantity"
                  :inputStyle="!isValidQuantity ? 'error' : null" />
            </div>
            <p v-if="!isValidQuantity" class="error">Please enter quantity.</p>
            <div  v-if="!isSuccess" class="fieldset">
                <span class="fieldset-title">Contact information</span>
                <cg-input
                  type="email"
                  placeholder="Email"
                  v-model="email"
                  :inputStyle="!isValidEmail ? 'error' : null" />
                <p v-if="!isValidEmail" class="error">Please enter valid email address.</p>
            </div>
            <div v-if="!isSuccess" class="fieldset">
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
                <p v-if="!areFieldsEmpty" class="error">Please enter valid shipping address informations.</p>
            </div>
            <!-- <div v-if="!isSuccess" class="fieldset">
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
            </div> -->
            <div class="graphic-controls">
                <cg-button button-style="secondary" @click="$emit('closePrintForm')">Back</cg-button>
                <cg-button v-if="!isSuccess" type="submit" :loading="isSubmitting">Order</cg-button>
                <!-- <price v-if="!isSuccess" value="0.05" /> -->
            </div>
            <p v-if="formError" class="form-error">There was an error submitting the form. Please try again.</p>
        </form>
    </div>
</template>

<script>
import { sendETHtoAddress } from 'services/ethereumService';
import axios from 'axios';
import { PRINT_ORDERS_ADDRESS } from 'config/constants';
import { METAMASK_ADDRESS } from 'store/user-config/types';
import { mapGetters } from 'vuex';

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
    shippingMethod: 'Printful',
    printPrice: 0.05,
    isValidEmail: true,
    isValidQuantity: true,
    areFieldsEmpty: true,
    isSubmitting: false,
    formError: false,
    isSuccess: false
  }),
  props: {
    goBack: {
      type: Function,
      default: () => {},
    }
  },
  computed: {
      ...mapGetters({
          userAddress: METAMASK_ADDRESS
      })
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
      if (!this.isValidEmail || !this.isValidQuantity || !this.areFieldsEmpty) {
        this.isSubmitting = false;
        return false;
      };
      return true;
    },
    orderPrint() {
      // const price = this.printPrice * this.quantity;
      // sendETHtoAddress(this.userAddress, PRINT_ORDERS_ADDRESS, price.toString());
      this.isSubmitting = true;
      this.formError = false;
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
          this.isSuccess = true;
          this.isSubmitting = false;
        })
        .catch(err => {
          this.isSubmitting = false;
          this.formError = true;
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
    .error {
      color: #BE0000;
    }
    .form-error {
      color: #BE0000;
      margin: 25px 0;
    }
    .form-success {
      color: black;
      font-weight: bold;
      margin: 30px 0;
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
