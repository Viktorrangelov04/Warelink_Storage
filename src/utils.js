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

export function calculatePrice(buyPrice, margin, rounding = 0.05) {
  const raw = buyPrice * (1 + margin);
  return Math.ceil(raw / rounding) * rounding;
}
