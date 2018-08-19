import React from "react";
import Price from "./price"

const PricesList = ({ prices }) => prices.map(({ nombre, precio }) => (
    <Price key={nombre} name={nombre} price={precio} />
))

export default PricesList;