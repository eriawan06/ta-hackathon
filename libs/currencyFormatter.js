export function getFormattedIDR(amount) {
  const value = parseInt(amount)
  const valueText =
    value > 1000000000
      ? `${Math.round(value / 10000000) / 100} billion`
      : value > 1000000
      ? `${Math.round(value / 10000) / 100} million`
      : value.toLocaleString('id')

  return `Rp. ${valueText}`
}
