import { defineVuetifyConfiguration } from "vuetify-nuxt-module/custom-configuration";

export default defineVuetifyConfiguration({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1976d2"
        }
      }
    }
  },
  defaults: {
    VTextField: { variant: "underlined", color: "primary" },
    VAutocomplete: { variant: "underlined", color: "primary" },
    VSelect: { variant: "underlined", color: "primary" },
    VCombobox: { variant: "underlined", color: "primary" },
    VTextarea: { variant: "underlined", color: "primary" },
    VFileInput: { variant: "underlined", color: "primary" },
    VRadioGroup: { color: "primary" },
    VRadio: { color: "primary" },
    VCheckbox: { color: "primary" },
    VTabs: { color: "primary" },
    VDataTable: { color: "primary" },
    VDataTableServer: { color: "primary" }
  }
});
