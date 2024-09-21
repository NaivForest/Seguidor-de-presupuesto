export const Currencies = [
    {value: "GTQ", label: "Q Quetzal", locale: "es-GT"},
    {value: "USD", label: "$ Dolar", locale: "en-US"},
    {value: "EUR", label: "€ Euro", locale: "de-DE"},
    {value: "JPY", label: "¥ Yen", locale: "ja-JP"},
    {value: "GBP", label: "£ Libra Esterlina", locale: "en-GB"}
];

export type Currency = (typeof Currencies)[0];