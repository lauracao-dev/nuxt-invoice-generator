<template>
  <v-container v-if="form">

    <!-- Button Section - if path includes "/document" only -->
    <v-row
      v-if="$route.name !== 'document-view'"
      align="center"
      dense
    >
      <!-- Switch column -->
      <v-col>
        <v-switch
          v-model="isEditMode"
          inset
          label="Edit Mode"
        ></v-switch>
      </v-col>

      <!-- Buttons column -->
      <v-col class="d-flex flex-row justify-end">
        <v-btn
          v-if="isEditMode"
          @click="saveToDbWithSnackbar"
          color="primary"
          width="120"
          class="ml-3"
        >
          <v-icon left>mdi-check</v-icon>
          Save
        </v-btn>

        <v-btn
          v-if="isEditMode"
          @click="createNew"
          color="primary"
          width="120"
          class="ml-3"
        >
          <v-icon left>mdi-note-plus</v-icon>
          New
        </v-btn>

        <!-- v-dialog start -->
        <div
          class="text-center"
          v-if="!isEditMode"
        >
          <v-dialog
            v-model="isDialogShowing"
            width="unset"
          >
            <template v-slot:activator="{ on, attrs }">
              <!-- button if saved  -->
              <v-btn
                v-if="form.id"
                color="primary"
                v-bind="attrs"
                v-on="on"
                class="ml-3"
                width="120"
              >
                <v-icon left>mdi-share</v-icon>
                Share
              </v-btn>

              <!-- button if not saved yet  -->
              <v-btn
                v-else
                color="grey"
                v-bind="attrs"
                v-on="on"
                class="ml-3"
                width="120"
                elevation="0"
                plain
                outlined
              >
                <v-icon left>mdi-share</v-icon>
                Share
              </v-btn>
            </template>

            <!-- dialog if saved -->
            <v-card v-if="form.id">
              <v-card-title class="text-body-1 deep-purple lighten-5">
                Your share link is ready!
              </v-card-title>

              <v-card-text class="align-center d-flex flex-row mt-5">
                <!-- v-clipboard start (uses vue-clipboard2 plugin) -->
                <v-text-field
                  v-model="shareUrl"
                  readonly
                  outlined
                  prepend-inner-icon="mdi-link"
                  hide-details
                  dense
                  class="text-grey"
                >
                </v-text-field>

                <v-btn
                  v-clipboard:copy="shareUrl"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                  color="primary"
                  class="ml-2"
                >
                  <v-icon left>mdi-content-copy</v-icon>
                  Copy
                </v-btn>
                <!-- v-clipboard end -->
              </v-card-text>

              <v-card-text class="text-caption">
                Note: Saving changes on your current copy will also update the
                public copy.
              </v-card-text>
            </v-card>

            <!-- dialog if not saved yet -->
            <v-card v-else>
              <v-card-title class="text-body-1 deep-purple lighten-5">Please save first before sharing!</v-card-title>
              <v-card-text class="mt-5 text-center">
                <v-btn
                  @click="isDialogShowing = false"
                  outlined
                  color="primary"
                  small
                >
                  Close
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
        </div>
        <!-- v-dialog end -->

        <v-btn
          v-if="!isEditMode"
          @click="print"
          class="ml-3"
          color="primary"
          width="120"
        >
          <v-icon left>mdi-printer</v-icon>
          Print
        </v-btn>
      </v-col>

      <!-- v-snackbar start -->
      <v-snackbar
        timeout="1000"
        v-model="isSnackbarShowing"
        dark
        top
        color="deep-purple darken-5"
      >
        <span class="white--text"> {{ snackbarText }} </span>

        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="isSnackbarShowing = false"
            color="white"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <!-- v-snackbar end -->
    </v-row>

    <!-- Button Section - if path includes "/document-view" -->
    <v-row v-if="$route.name === 'document-view'">
      <v-col class="d-flex flex-row justify-end">
        <v-btn
          v-if="$route.params.id"
          @click="print"
          color="primary"
          width="120"
        >
          <v-icon left>mdi-printer</v-icon>
          Print
        </v-btn>
      </v-col>
    </v-row>

    <!-- Edit Link Section (only appears once saved) -->
    <v-row
      v-if="isEditMode && editUrl && $route.name !== 'document-view'"
      dense
    >
      <v-col>
        <span class="primary--text text-body-2">Your unique edit link:</span>
        <div class="d-flex flex-row align-center">
          <v-text-field
            v-model="editUrl"
            readonly
            dense
            hide-details
            prepend-inner-icon="mdi-link"
            disabled
            filled
            rounded
          >
          </v-text-field>
          <v-btn
            v-clipboard:copy="editUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            color="primary"
            class="ml-3"
            width="120"
            outlined
          >
            <v-icon left>mdi-content-copy</v-icon>
            Copy
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Form Section -->
    <v-row dense>
      <v-col>
        <v-card class="pa-8">
          <!-- print container (From Section only) -->
          <v-container id="printdocument">

            <!-- Company Details ******************************************************************  -->
            <v-row class="mt-5 mb-5">
              <!-- Left ---------------------------------------------------------------->
              <v-col>

                <v-row dense>
                  <v-col class="d-flex flex-row align-center">
                    <!-- else !isEditMode -->
                    <div
                      v-if="logoURL"
                      class="align-left"
                      style="flex: 0 0 auto"
                    >
                      <v-img
                        :src="logoURL"
                        width="30"
                        class="shrink mr-2"
                        contain
                      ></v-img>
                    </div>
                    <!-- if isEditMode -->
                    <v-file-input
                      v-if="isEditMode"
                      v-model="companyLogo"
                      @change="uploadLogo"
                      class="mr-2"
                      outlined
                      label="[Add Logo]"
                      prepend-inner-icon="mdi-paperclip"
                      prepend-icon=""
                      dense
                      hide-details
                    ></v-file-input>
                    <!-- if isEditMode -->
                    <v-text-field
                      v-if="isEditMode"
                      label="Your Company Name"
                      v-model="form.companyName"
                      outlined
                      dense
                      hide-details
                      class="text-grey"
                    ></v-text-field>
                    <!-- else  -->
                    <!-- class="text-h6" -->
                    <div v-else>
                      <h2>{{ form.companyName }}</h2>
                    </div>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col>
                    <!-- if isEditMode  -->
                    <v-textarea
                      v-if="isEditMode"
                      label="Your Company Details"
                      v-model="form.companyDetails"
                      outlined
                      dense
                      hide-details
                      class="text-grey mt-1"
                    ></v-textarea>
                    <!-- else  -->
                    <div v-else>
                      <span style="white-space: pre-line">{{ form.companyDetails }}
                      </span>
                    </div>
                  </v-col>
                </v-row>

              </v-col>

              <!-- Right ---------------------------------------------------------------->
              <v-col :cols="isEditMode ? 4 : 3">

                <v-row dense>
                  <v-col class="d-flex flex-row align-center">
                    <!-- if isEditMode -->
                    <v-text-field
                      v-if="isEditMode"
                      label="Invoice/Quote"
                      v-model="form.invoiceOrQuote"
                      outlined
                      dense
                      hide-details
                      class="text-grey"
                    ></v-text-field>

                    <v-text-field
                      v-if="isEditMode"
                      label="Number"
                      v-model="form.invoiceNumber"
                      outlined
                      dense
                      class="text-grey pl-2"
                      hide-details
                    ></v-text-field>
                    <!-- else -->
                    <h2
                      v-else
                      style="white-space: pre-line"
                    >{{ form.invoiceOrQuote }} #{{ form.invoiceNumber }}
                    </h2>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col>
                    <!-- if isEditMode -->
                    <template v-if="isEditMode">
                      <!-- v-for start -->
                      <Draggable
                        v-model="form.dates"
                        group="people"
                        @start="drag = true"
                        @end="drag = false"
                      >
                        <div
                          v-for="(date, index) in form.dates"
                          :key="date.id"
                          class="d-flex flex-row align-center"
                        >
                          <v-text-field
                            v-model="date.value"
                            class="mb-2 text-grey"
                            outlined
                            hide-details
                            dense
                          ></v-text-field>
                          <v-btn
                            @click="removeDate(index)"
                            icon
                            small
                          >
                            <v-icon small>mdi-close</v-icon>
                          </v-btn>
                        </div>
                      </Draggable>
                      <!-- v-for end -->

                      <v-btn
                        @click="addDate"
                        small
                        outlined
                        color="primary"
                      >
                        <v-icon
                          left
                          small
                        >mdi-plus</v-icon>
                        Add Details
                      </v-btn>
                    </template>

                    <!-- else !isEditMode -->
                    <template v-else>
                      <!-- v-for start -->
                      <div
                        v-for="(date, index) in form.dates"
                        :key="index"
                      >
                        <span> {{ date.value }} </span>
                      </div>
                      <!-- v-for end -->
                    </template>

                  </v-col>
                </v-row>

              </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- Customer Details ******************************************************************  -->
            <v-row class="mt-5 mb-5">
              <v-col cols="8">
                <v-row>
                  <v-col class="font-weight-bold text-grey">
                    <h3>To:</h3>
                  </v-col>
                </v-row>

                <div class="mt-2">
                  <!-- if isEditMode -->
                  <v-text-field
                    v-if="isEditMode"
                    label="Customer Name"
                    v-model="form.customerName"
                    outlined
                    dense
                    hide-details
                    class="text-grey"
                  ></v-text-field>
                  <!-- else -->
                  <div v-else>
                    {{ form.customerName }}
                  </div>
                </div>

                <v-row dense>
                  <!-- if isEditMode -->
                  <v-col
                    v-if="isEditMode"
                    class="mt-3"
                  >
                    <v-textarea
                      label="Customer Details"
                      v-model="form.customerDetails"
                      outlined
                      dense
                      hide-details
                      class="text-grey"
                    ></v-textarea>
                  </v-col>
                  <!-- else -->
                  <v-col v-else>
                    <div style="white-space: pre-line">{{ form.customerDetails }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- Item List ******************************************************************  -->
            <!-- if isEditMode -->
            <v-row
              v-if="isEditMode"
              class="mt-2 mb-4"
            >
              <v-col>
                <!-- List ------------------------------------------------------------------------------------------>
                <!-- v-for start (uses vuedraggable plugin)-->
                <Draggable
                  v-model="form.items"
                  group="people"
                  @start="drag = true"
                  @end="drag = false"
                >
                  <v-card
                    v-for="(item, index) in form.items"
                    :key="item.id"
                    outlined
                    class="mt-3"
                  >
                    <v-card-text>
                      <v-row>
                        <!-- Input: Description ------------------------------------------>
                        <v-col>
                          <!-- -->
                          <v-row dense>
                            <v-col class="d-flex flex-row align-center">
                              <v-text-field
                                v-model="item.type"
                                label="Service Type"
                                outlined
                                dense
                                hide-details
                                class="text-grey"
                              ></v-text-field>
                            </v-col>
                          </v-row>

                          <!-- -->
                          <v-row dense>
                            <v-col class="d-flex flex-row align-center">
                              <v-textarea
                                v-model="item.desc"
                                label="Service Description"
                                outlined
                                dense
                                hide-details
                                height="80"
                                class="text-grey"
                              ></v-textarea>
                            </v-col>
                          </v-row>
                        </v-col>

                        <!-- Input: Calculation ------------------------------------------>
                        <v-col>
                          <v-row>
                            <!-- -->
                            <v-col>
                              <v-text-field
                                v-model="item.unitPrice"
                                label="Unit Price"
                                outlined
                                dense
                                class="text-grey"
                              ></v-text-field>
                            </v-col>

                            <!-- -->
                            <v-col>
                              <v-text-field
                                v-model="item.quantity"
                                label="Quantity"
                                outlined
                                dense
                                class="text-grey"
                              ></v-text-field>
                            </v-col>

                            <!-- -->
                            <v-col class="body-1 text-grey">
                              ${{ item.unitPrice * item.quantity }}
                            </v-col>
                          </v-row>
                        </v-col>

                        <!-- Divider & X ------------------------------------------>
                        <v-divider vertical></v-divider>
                        <v-btn
                          icon
                          @click="removeItem(index)"
                        >
                          <v-icon small>mdi-close</v-icon>
                        </v-btn>

                      </v-row>
                    </v-card-text>
                  </v-card>
                </Draggable>
                <!-- v-for end -->

                <!-- Add Button ------------------------------------------------------------------------------------------>
                <v-row>
                  <v-col>
                    <v-btn
                      @click="addItem"
                      color="primary"
                      outlined
                      class="mt-3"
                    >
                      <v-icon left>mdi-plus</v-icon>
                      Add Item
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- else !isEditMode -->
            <v-container
              v-else
              class="print-break"
            >
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <th class="text-left">ITEM</th>
                      <th class="text-left">DESCRIPTION</th>
                      <th class="text-left">PRICE</th>
                      <th class="text-center">QTY</th>
                      <th class="text-right">TOTAL</th>
                    </tr>
                    <tr
                      v-for="(item, index) in form.items"
                      :key="index"
                    >
                      <td>{{ item.type }}</td>
                      <td>{{ item.desc }}</td>
                      <td>{{ item.unitPrice }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-right">
                        {{ item.unitPrice * item.quantity }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>

            <v-divider></v-divider>

            <!-- Totals ******************************************************************  -->
            <v-row class="mt-5 mb-5">
              <!-- Total Left -------------------------------->
              <v-col>
                <v-row dense>
                  <v-col>
                    <!-- if isEditMode -->
                    <v-text-field
                      v-if="isEditMode"
                      label="Your Business Representative"
                      v-model="form.bizRep"
                      outlined
                      dense
                      hide-details
                      class="text-grey"
                    ></v-text-field>
                    <!-- else !isEditMode -->
                    <div v-else>
                      <span class="font-weight-bold text-grey">
                        Business Representative:
                      </span>
                      {{ form.bizRep }}
                    </div>
                  </v-col>
                </v-row>

                <v-row dense>
                  <v-col>
                    <!-- if isEditMode -->
                    <v-textarea
                      v-if="isEditMode"
                      v-model="form.thanks"
                      outlined
                      dense
                      height="80"
                      hide-details
                      class="text-grey"
                    ></v-textarea>
                    <!-- else !isEditMode -->
                    <div v-else>
                      {{ form.thanks }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <!-- Total Right -------------------------------->
              <v-col cols="4">
                <div class="d-flex flex-row align-center">
                  <span style="width: 50%"> Subtotal:</span>
                  <span
                    style="width: 50%"
                    class="text-right"
                  >
                    {{ formatCurrency(subtotal) }}
                  </span>
                </div>

                <!-- if isEditMode -->
                <template v-if="isEditMode">
                  <!-- v-for start -->
                  <Draggable
                    v-model="form.fees"
                    group="people"
                    @start="drag = true"
                    @end="drag = false"
                  >
                    <div
                      v-for="(fee, index) in form.fees"
                      :key="fee.id"
                      class="d-flex flex-row align-center"
                    >
                      <v-text-field
                        v-model="fee.key"
                        style="width: 50%"
                        outlined
                        hide-details
                        dense
                        class="text-grey mr-1 mb-1"
                      ></v-text-field>
                      <v-text-field
                        v-model="fee.value"
                        style="width: 50%"
                        outlined
                        hide-details
                        dense
                        class="text-grey mb-1"
                      ></v-text-field>
                      <v-btn
                        @click="removeFee(index)"
                        icon
                        small
                      >
                        <v-icon small>mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </Draggable>
                  <!-- v-for end -->

                  <v-btn
                    @click="addFee"
                    small
                    outlined
                    color="primary"
                    class="mt-1"
                  >
                    <v-icon
                      left
                      small
                    >mdi-plus</v-icon>
                    Add Subtotal
                  </v-btn>
                </template>

                <!-- else !isEditMode -->
                <template v-else>
                  <!-- v-for start -->
                  <div
                    v-for="(fee, index) in form.fees"
                    :key="index"
                    class="d-flex flex-row align-center"
                  >
                    <span style="width: 50%"> {{ fee.key }}:</span>
                    <span
                      style="width: 50%"
                      class="text-right"
                    >
                      {{ formatCurrency(fee.value * 1) }}
                    </span>
                  </div>
                  <!-- v-for end -->
                </template>

                <v-divider class="mt-3 pb-3"></v-divider>

                <div class="
                      d-flex
                      flex-row
                      align-center
                      font-weight-bold
                      text-grey
                    ">
                  <span style="width: 50%">Total: </span>
                  <span
                    style="width: 50%"
                    class="text-right"
                  >
                    {{ formatCurrency(total) }}
                  </span>
                </div>
              </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- Notes ******************************************************************  -->
            <v-row class="mt-5 mb-5">
              <v-col>
                <!-- if isEditMode -->
                <v-textarea
                  label="Additional Notes"
                  v-if="isEditMode"
                  height="75"
                  outlined
                  v-model="form.note"
                  class="text-grey"
                ></v-textarea>
                <!-- else !isEditMode -->
                <div
                  v-else
                  style="white-space: pre-line"
                >
                  <span class="font-weight-bold">Note:</span>
                  {{ form.note }}
                </div>
              </v-col>
            </v-row>

          </v-container>
          <!-- print container end -->
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "invoice-generator",

  components: {
    Draggable: draggable,
  },

  data() {
    return {
      isEditMode: true,
      logoURL: null,
      companyLogo: null,
      form: null,
      isDialogShowing: false,
      isSnackbarShowing: false,
      snackbarText: "",
      editUrl: null,
    };
  },

  computed: {
    apiPath() {
      return `${this.$config.apiURL}/invoices-db`
    },
    shareUrl() {
      return `${window.location.origin}/document-view/${this.form.id}`
    },
    subtotal() {
      return this.form.items.reduce((a, item) => {
        return a + item.unitPrice * item.quantity * 1;
      }, 0);
    },
    total() {
      return (
        this.form.fees.reduce((a, item) => {
          return a + item.value * 1;
        }, 0) +
        this.form.items.reduce((a, item) => {
          return a + item.unitPrice * item.quantity * 1;
        }, 0)
      );
    },
  },

  methods: {
    // save without snackbar popup (for Share button)
    saveToDb() {
      let httpVerb;
      if (!this.form.id) {
        httpVerb = "POST";
      } else {
        httpVerb = "PUT";
      }
      fetch(
        `${this.apiPath}/${httpVerb === "POST" ? "" : this.form.id}`,
        {
          method: httpVerb,
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          // if POST, back-end will return an ID
          if (httpVerb = "POST") {
            this.form.id = data
            this.editUrl = `${window.location.origin}/document/${data}`
          }
          let path = `/document/${data}`;
          if (this.$route.path !== path) {
            window.history.pushState(null, '', path)
          }
        });
    },

    // save with snackbar popup (for Save button)
    saveToDbWithSnackbar() {
      this.isSnackbarShowing = true;
      this.snackbarText = "Saved!";
      this.saveToDb();
    },

    createNew() {
      this.editUrl = null
      this.$router.push("/document");
      this.form = { ...this.$store.state.sampleInvoice }
    },

    // for 'vue-clipboard2'
    onCopy: function (e) {
      this.isSnackbarShowing = true;
      this.snackbarText = "Copied!";
    },

    // for 'vue-clipboard2'
    onError: function (e) {
      alert("Failed to copy texts");
    },

    print() {
      window.print();
    },

    uploadLogo() {
      this.logoURL = window.URL.createObjectURL(this.companyLogo);
    },

    // Date methods
    addDate() {
      this.form.dates.push({
        id:
          this.form.dates.reduce((a, item) => {
            return item.id > a ? item.id : a;
          }, 0) + 1,
        value: "",
      });
    },
    removeDate(position) {
      this.form.dates.splice(position, 1);
    },

    // Item List methods
    addItem() {
      this.form.items.push({
        id:
          this.form.items.reduce((a, item) => {
            return item.id > a ? item.id : a;
          }, 0) + 1,
        type: "",
        desc: "",
        unitPrice: 0,
        quantity: 0,
      });
    },
    removeItem(position) {
      this.form.items.splice(position, 1);
    },

    // Totals methods
    addFee() {
      this.form.fees.push({
        id:
          this.form.fees.reduce((a, item) => {
            return item.id > a ? item.id : a;
          }, 0) + 1,
        key: "",
        value: 0,
      });
    },
    removeFee(position) {
      this.form.fees.splice(position, 1);
    },

    formatCurrency(val) {
      let formatter = new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 2,
      });
      return formatter.format(val);
    },
  },

  mounted() {
    this.isEditMode = this.$route.name !== "document-view";

    let id = this.$route.params.id

    if (!id) {
      this.form = { ...this.$store.state.sampleInvoice }
    } else {
      fetch(`${this.apiPath}/${id}`)
        .then(async (response) => {
          if (response.ok) { 
            let data = await response.json();
            this.form = data 
            this.form.id = id
            this.editUrl = `${window.location.origin}/document/${id}`
          } else {
            if (response.status === 404) {
              this.$router.push("/error");
            }
            throw "error";
          }
        })
        .catch(() => {
          console.log("ERROR");
        });
    }

  },
};
</script>

<style>
h2 {
  font-weight: 500;
}

/* text-grey (custom) differentiates b/w text-field/text-area and switches*/
.text-grey input,
textarea {
  color: #5e5669 !important;
  opacity: 0.9 !important;
}

/* FONT COLOR VCARD: i.e. all text on PREVIEW */
.theme--light.v-card > .v-card__text,
.theme--light.v-card > .v-card__subtitle {
  color: #858585 !important;
}

/* BORDER COLOR: input fields on BLUR only*/
.theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)
  > .v-input__control
  > .v-input__slot
  fieldset {
  color: #c6c6c6 !important;
}

/* FONT COLOR: table*/
tbody {
  color: #858585 !important;
}
thead {
  color: #858585 !important;
  opacity: 0.8 !important;
}

/* HOVER COLOR: v-table */
.theme--light.v-data-table
  tbody
  tr:hover:not(.v-data-table__expanded__content) {
  background: #f9f9f9 !important;
}

/* v-select font color */
.v-select__selection,
.v-select__selection--comma,
.v-select.v-text-field input {
  color: #5e5669 !important;
}

v-select {
  max-width: 350px;
}

/* FONT COLOR: all divs */
div {
  color: #858585 !important;
}

@media print {
  #printdocument,
  #page {
    width: 100vw;
    margin: 0;
    float: none;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  * {
    visibility: hidden;
  }

  #printdocument,
  #printdocument * {
    visibility: initial;
  }

  #printdocument {
    padding: 0px !important;
    position: absolute;
    transform: scale(0.75);
    transform-origin: 0 0;
    width: 133.33333vw;
    max-width: 133.33333vw;
  }

  .print-break {
    page-break-before: always;
    page-break-after: always;
  }

  @page {
    margin: 1.5cm;
  }

  *:not(#printdocument, #printdocument *) {
    position: absolute;
    padding: 0 !important;
    margin: 0 !important;
    width: 0% !important;
    height: 0% !important;
  }
}
</style>
