import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";

export default defineVuetifyConfiguration({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1976d2",
          info: "#7b1fa2"
        }
      }
    }
  },
  defaults: {
    VTextField: { color: "primary" },
    VAutocomplete: { color: "primary" },
    VSelect: { color: "primary" },
    VCombobox: { color: "primary" },
    VTextarea: { color: "primary" },
    VFileInput: { color: "primary" },
    VRadioGroup: { color: "primary" },
    VRadio: { color: "primary" },
    VCheckbox: { color: "primary" },
    VTabs: { color: "primary" },
    VDataTable: { color: "primary" },
    VDataTableServer: { color: "primary" }
  }
});
