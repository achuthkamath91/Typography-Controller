class TypographyController extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    // 1. Load external HTML + CSS
    const [html, css] = await Promise.all([
      fetch("../src//typography-controller.html").then(r => r.text()),
      fetch("../src/typography-controller.css").then(r => r.text())
    ]);

    // 2. Inject into shadow DOM
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      ${html}
    `;

    // 3. Now safe to query elements
    this.targetSelector = this.getAttribute("target");

    // Feature toggles
    this.toggleGroup("#groupLetterSpacing", !this.hasAttribute("hide-letter-spacing"));
    this.toggleGroup("#groupWordSpacing", !this.hasAttribute("hide-word-spacing"));
    this.toggleGroup("#groupLineHeight", !this.hasAttribute("hide-line-height"));
    this.toggleGroup("#groupContrast", !this.hasAttribute("hide-contrast"));
    this.toggleGroup("#groupFamily", !this.hasAttribute("hide-font-family"));

    // Query sliders
    this.fontSize = this.shadowRoot.querySelector("#fontSize");
    this.letterSpacing = this.shadowRoot.querySelector("#letterSpacing");
    this.wordSpacing = this.shadowRoot.querySelector("#wordSpacing");
    this.lineHeight = this.shadowRoot.querySelector("#lineHeight");
    this.contrast = this.shadowRoot.querySelector("#contrast");
    this.fontFamily = this.shadowRoot.querySelector("#fontFamily");

    // Auto-detect font family
    const target = this.targetElement;
    if (target) {
      const computed = getComputedStyle(target).fontFamily;
      this.fontFamily.value = computed;
    }

    // Query value labels
    this.fontSizeValue = this.shadowRoot.querySelector("#fontSizeValue");
    this.letterSpacingValue = this.shadowRoot.querySelector("#letterSpacingValue");
    this.wordSpacingValue = this.shadowRoot.querySelector("#wordSpacingValue");
    this.lineHeightValue = this.shadowRoot.querySelector("#lineHeightValue");
    this.contrastValue = this.shadowRoot.querySelector("#contrastValue");

    // 4. Bind value ranges
    this.applyRange(this.fontSize, "font-size-min", "font-size-max");
    this.applyRange(this.letterSpacing, "letter-spacing-min", "letter-spacing-max");
    this.applyRange(this.wordSpacing, "word-spacing-min", "word-spacing-max");
    this.applyRange(this.lineHeight, "line-height-min", "line-height-max");
    this.applyRange(this.contrast, "contrast-min", "contrast-max");


    // Event handler
    const updateAndEmit = () => {
      this.update();
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: this.getValues(),
          bubbles: true,
          composed: true
        })
      );
    };

    // Bind events
    this.fontSize.addEventListener("input", updateAndEmit);
    this.letterSpacing.addEventListener("input", updateAndEmit);
    this.wordSpacing.addEventListener("input", updateAndEmit);
    this.lineHeight.addEventListener("input", updateAndEmit);
    this.contrast.addEventListener("input", updateAndEmit);
    this.fontFamily.addEventListener("change", updateAndEmit);

    this.bindSlider(this.fontSize, this.fontSizeValue, "Font size");
    this.bindSlider(this.letterSpacing, this.letterSpacingValue, "Letter spacing");
    this.bindSlider(this.wordSpacing, this.wordSpacingValue, "Word spacing");
    this.bindSlider(this.lineHeight, this.lineHeightValue, "Line height");
    this.bindSlider(this.contrast, this.contrastValue, "Contrast");


    // Initial update
    this.update();
  }

  toggleGroup(id, show) {
    const el = this.shadowRoot.querySelector(id);
    if (el) el.style.display = show ? "block" : "none";
  }

  get targetElement() {
    return document.querySelector(this.targetSelector);
  }

  update() {
    const target = this.targetElement;
    if (!target) return;

    target.style.fontSize = `${this.fontSize.value}px`;
    target.style.letterSpacing = `${this.letterSpacing.value}px`;
    target.style.wordSpacing = `${this.wordSpacing.value}px`;
    target.style.lineHeight = this.lineHeight.value;
    target.style.filter = `contrast(${this.contrast.value}%)`;
    target.style.fontFamily = this.fontFamily.value;

    this.fontSizeValue.textContent = `${this.fontSize.value}px`;
    this.letterSpacingValue.textContent = `${this.letterSpacing.value}px`;
    this.wordSpacingValue.textContent = `${this.wordSpacing.value}px`;
    this.lineHeightValue.textContent = this.lineHeight.value;
    this.contrastValue.textContent = `${this.contrast.value}%`;
  }

  getValues() {
    return {
      fontSize: Number(this.fontSize.value),
      letterSpacing: Number(this.letterSpacing.value),
      wordSpacing: Number(this.wordSpacing.value),
      lineHeight: Number(this.lineHeight.value),
      contrast: Number(this.contrast.value),
      fontFamily: this.fontFamily.value
    };
  }

  setValues(values = {}) {
    if (values.fontSize !== undefined) this.fontSize.value = values.fontSize;
    if (values.letterSpacing !== undefined) this.letterSpacing.value = values.letterSpacing;
    if (values.wordSpacing !== undefined) this.wordSpacing.value = values.wordSpacing;
    if (values.lineHeight !== undefined) this.lineHeight.value = values.lineHeight;
    if (values.contrast !== undefined) this.contrast.value = values.contrast;

    if (values.fontFamily !== undefined) {
      const target = this.targetElement;
      if (values.fontFamily === "inherit" && target) {
        const computed = getComputedStyle(target).fontFamily;
        this.fontFamily.value = computed;
      } else {
        this.fontFamily.value = values.fontFamily;
      }
    }

    this.update();
  }

  setFeatures(features = {}) {
    if (features.letterSpacing !== undefined) {
      this.toggleGroup("#groupLetterSpacing", features.letterSpacing);
      features.letterSpacing
        ? this.removeAttribute("hide-letter-spacing")
        : this.setAttribute("hide-letter-spacing", "");
    }

    if (features.wordSpacing !== undefined) {
      this.toggleGroup("#groupWordSpacing", features.wordSpacing);
      features.wordSpacing
        ? this.removeAttribute("hide-word-spacing")
        : this.setAttribute("hide-word-spacing", "");
    }

    if (features.lineHeight !== undefined) {
      this.toggleGroup("#groupLineHeight", features.lineHeight);
      features.lineHeight
        ? this.removeAttribute("hide-line-height")
        : this.setAttribute("hide-line-height", "");
    }

    if (features.contrast !== undefined) {
      this.toggleGroup("#groupContrast", features.contrast);
      features.contrast
        ? this.removeAttribute("hide-contrast")
        : this.setAttribute("hide-contrast", "");
    }
    if (features.fontFamily !== undefined) {
      this.toggleGroup("#groupFontFamily", features.fontFamily);
      features.fontFamily
        ? this.removeAttribute("hide-font-family")
        : this.setAttribute("hide-font-family", "");
    }
  }

  bindSlider(slider, valueEl, labelText) {
    // Initialize visible value
    valueEl.textContent = slider.value;

    slider.addEventListener("input", () => {
      const val = slider.value;

      // Update visible value
      valueEl.textContent = val;

      // Update ARIA so NVDA knows the value changed
      slider.setAttribute("aria-valuenow", val);

      // Emit your existing event
      this.update();
      this.dispatchEvent(
        new CustomEvent("change", {
          detail: this.getValues(),
          bubbles: true,
          composed: true
        })
      );
    });
  }

  applyRange(slider, attrMin, attrMax) {
    const min = this.getAttribute(attrMin);
    const max = this.getAttribute(attrMax);

    if (min !== null) {
      slider.min = min;
      slider.setAttribute("aria-valuemin", min);
    }

    if (max !== null) {
      slider.max = max;
      slider.setAttribute("aria-valuemax", max);
    }
  }

}

customElements.define("typography-controller", TypographyController);
