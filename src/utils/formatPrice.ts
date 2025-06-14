const formatPrice = (price: number | string): string => {
  // Convert the input to a number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  // Handle invalid numeric conversion (NaN)
  if (isNaN(numericPrice)) {
    return "0"
  }

  return numericPrice.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default formatPrice;
