class TypographyController extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, sans-serif;
          max-width: 420px;
          padding: 18px 20px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(14px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          color: #0f172a;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 14px;
        }

        .title {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #475569;
        }

        .badge {
          font-size: 11px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.12);
          color: #1d4ed8;
          border: 1px solid rgba(59, 130, 246, 0.35);
        }

        .group {
          margin-bottom: 14px;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: #0f172a;
        }

        .value {
          font-size: 11px;
          color: #64748b;
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }

        select {
          width: 100%;
          padding: 6px 8px;
          border-radius: 8px;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: rgba(255, 255, 255, 0.9);
          font-size: 12px;
          color: #0f172a;
          outline: none;
        }

        select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
        }
      </style>

      <div class="header">
        <div class="title">Typography Controls</div>
        <div class="badge">Web Component</div>
      </div>

      <div class="group" id="groupFontSize">
        <div class="label-row">
          <label for="fontSize">Font size</label>
          <span class="value" id="fontSizeValue"></span>
        </div>
        <input type="range" id="fontSize" min="12" max="60" value="24">
      </div>

      <div class="group" id="groupLetterSpacing">
        <div class="label-row">
          <label for="letterSpacing">Letter spacing</label>
          <span class="value" id="letterSpacingValue"></span>
        </div>
        <input type="range" id="letterSpacing" min="0" max="20" value="0">
      </div>

      <div class="group" id="groupWordSpacing">
        <div class="label-row">
          <label for="wordSpacing">Word spacing</label>
          <span class="value" id="wordSpacingValue"></span>
        </div>
        <input type="range" id="wordSpacing" min="0" max="40" value="0">
      </div>

      <div class="group" id="groupLineHeight">
        <div class="label-row">
          <label for="lineHeight">Line height</label>
          <span class="value" id="lineHeightValue"></span>
        </div>
        <input type="range" id="lineHeight" min="1" max="3" step="0.1" value="1.5">
      </div>

      <div class="group" id="groupContrast">
        <div class="label-row">
          <label for="contrast">Contrast</label>
          <span class="value" id="contrastValue"></span>
        </div>
        <input type="range" id="contrast" min="50" max="200" value="100">
      </div>

      <div class="group" id="groupFontFamily">
        <div class="label-row">
          <label for="fontFamily">Font family</label>
        </div>
        <select id="fontFamily">
          <option value="system-ui, sans-serif">System</option>
          <option value="Georgia, serif">Serif</option>
          <option value="'Courier New', monospace">Monospace</option>
          <option value="Verdana, sans-serif">Verdana</option>
        </select>
      </div>
    `;
  }

  connectedCallback() {
    this.targetSelector = this.getAttribute("target");

    // Read attributes for initial hiding
    this.toggleGroup("#groupLetterSpacing", !this.hasAttribute("hide-letter-spacing"));
    this.toggleGroup("#groupWordSpacing", !this.hasAttribute("hide-word-spacing"));
    this.toggleGroup("#groupLineHeight", !this.hasAttribute("hide-line-height"));
    this.toggleGroup("#groupContrast", !this.hasAttribute("hide-contrast"));

    // Query elements
    this.fontSize = this.shadowRoot.querySelector("#fontSize");
    this.letterSpacing = this.shadowRoot.querySelector("#letterSpacing");
    this.wordSpacing = this.shadowRoot.querySelector("#wordSpacing");
    this.lineHeight = this.shadowRoot.querySelector("#lineHeight");
    this.contrast = this.shadowRoot.querySelector("#contrast");
    this.fontFamily = this.shadowRoot.querySelector("#fontFamily");
    // ⭐ Auto‑detect the user's current font family
    const target = this.targetElement;
    if (target) {
      const computed = getComputedStyle(target).fontFamily;
      this.fontFamily.value = computed;
    }


    this.fontSizeValue = this.shadowRoot.querySelector("#fontSizeValue");
    this.letterSpacingValue = this.shadowRoot.querySelector("#letterSpacingValue");
    this.wordSpacingValue = this.shadowRoot.querySelector("#wordSpacingValue");
    this.lineHeightValue = this.shadowRoot.querySelector("#lineHeightValue");
    this.contrastValue = this.shadowRoot.querySelector("#contrastValue");

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

    this.fontSize.addEventListener("input", updateAndEmit);
    this.letterSpacing.addEventListener("input", updateAndEmit);
    this.wordSpacing.addEventListener("input", updateAndEmit);
    this.lineHeight.addEventListener("input", updateAndEmit);
    this.contrast.addEventListener("input", updateAndEmit);
    this.fontFamily.addEventListener("change", updateAndEmit);

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
    if (values.fontFamily !== undefined) this.fontFamily.value = values.fontFamily;

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
  }
}

customElements.define("typography-controller", TypographyController);