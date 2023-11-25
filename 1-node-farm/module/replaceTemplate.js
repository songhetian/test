module.exports = function(temp, product ) {
    let output = temp.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%PRODUCTID%}/g,product.id);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%PRODUCTFROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);

    if (!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }
    return output;
}