export function cleanProductName(name) {
    return name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/мл/g, "ml")
      .replace(/л(?![a-z])/g, "l")
      .replace(/гр/g, "g")
      .replace(/кг/g, "kg")
      .replace(/[.,]+$/, "");
  }