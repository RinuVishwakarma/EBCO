export const containsScreenReaderText = (html: string): boolean => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return !!doc.querySelector(".screen-reader-text");
};

const extractPrice = (element: Element | null): number | null => {
  if (!element) return null;
  const priceText = element.textContent!.replace(/[^\d.,]/g, "").trim();
  const priceNumber = parseFloat(
    priceText.replace(/,/g, "").replace(/(\.\d+).*/, "$1")
  );
  // console.log(priceNumber, "PRICE NUMBER");
  return isNaN(priceNumber) ? null : priceNumber;
};

export const extractRegularPrice = (html: string | null): number | null => {
  if (!html) return null;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const regularPriceElement = doc.querySelector(
    "del .woocommerce-Price-amount bdi"
  );
  if (!regularPriceElement) {
    // Try another selector if the first one fails
    const fallbackRegularPriceElement = doc.querySelector("del span bdi");
    return extractPrice(fallbackRegularPriceElement);
  }
  return extractPrice(regularPriceElement);
};

export const extractSalePrice = (html: string): number | null => {
  if (!html) return null;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const salePriceElement = doc.querySelector(
    "ins .woocommerce-Price-amount bdi"
  );
  if (!salePriceElement) {
    // Try another selector if the first one fails
    const fallbackSalePriceElement = doc.querySelector("ins span bdi");
    return extractPrice(fallbackSalePriceElement);
  }
  return extractPrice(salePriceElement);
};
