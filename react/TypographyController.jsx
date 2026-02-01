import { createComponent } from "@lit/react";
import React from "react";
import "../src/typography-controller.js";

export const TypographyController = createComponent({
  react: React,
  tagName: "typography-controller",
  elementClass: customElements.get("typography-controller"),
  events: {
    onChange: "change"
  }
});