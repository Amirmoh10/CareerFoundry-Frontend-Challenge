export async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw response.statusText;
  }

  return response.json();
}

export function getCurrencyPrice(prices, isInEurope) {
  console.debug(isInEurope);
  const currency = isInEurope ? "EUR" : "USD";
  const coursePrice = prices?.find(
    (price) => price.currency.toLowerCase() === currency.toLowerCase()
  );

  if (!coursePrice) {
    return "Price not available";
  }

  return coursePrice.amount.toLocaleString("en-US", {
    style: "currency",
    currency,
  });
}

export function formatDate(startDate) {
  const date = new Date(startDate);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-us", options);
}
