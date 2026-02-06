export class TypographyState {
  constructor(targetElement) {
    this.target = targetElement;
  }

  resolveFontFamily(value) {
    if (value === "inherit" && this.target) {
      return getComputedStyle(this.target).fontFamily;
    }
    return value;
  }

  apply(values = {}) {
    const resolved = { ...values };

    if (values.fontFamily !== undefined) {
      resolved.fontFamily = this.resolveFontFamily(values.fontFamily);
    }

    return resolved;
  }
}
