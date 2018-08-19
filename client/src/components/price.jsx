import React from "react";
import Currency from 'react-currency-formatter';

const Price = ({ name, price }) => (
    <div>
        <div className="h3">
            {name}
        </div>
        <div className="precio" >
            <Currency
                className={"precio"}
                quantity={price}
                currency="VEF"
            />
        </div>
    </div>
)

export default Price