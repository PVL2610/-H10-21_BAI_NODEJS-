const { v4: uuidv4 } = require('uuid');
const orderIds = new Set();
const orderDetails = new Map();

// Add new order
function addOrder(products) {
    if (products.length === 0) {
        throw new Error("An order must contain at least one product.");
    }
    const orderId = uuidv4();
    orderIds.add(orderId);
    orderDetails.set(orderId, products);
}

// Update an existing order
function updateOrder(orderId, updatedProducts) {
    if (!orderDetails.has(orderId)) {
        throw new Error(`Order with ID ${orderId} does not exist.`);
    }
    const allZeroQuantities = updatedProducts.every(product => product.productQuantity === 0);
    if (allZeroQuantities) {
        deleteOrder(orderId);
    } else {     
        orderDetails.set(orderId, updatedProducts);
    }
}

// Delete an order
function deleteOrder(orderId) {
    if (orderDetails.has(orderId)) {
        orderDetails.delete(orderId);
        orderIds.delete(orderId);
    } else {
        throw new Error(`Order with ID ${orderId} does not exist.`);
    }
}


// Calculate the order with the highest total value
function getMaxValueOrder() {
    let maxValue = 0;
    let maxOrderId = null;

    for (const [orderId, products] of orderDetails) {
        const totalValue = products.reduce((sum, product) => {
            return sum + (product.price * product.productQuantity);
        }, 0);

        if (totalValue > maxValue) {
            maxValue = totalValue;
            maxOrderId = orderId;
        }
    }

    return maxOrderId ? { orderId: maxOrderId, totalValue: maxValue } : null;
}

// Print all orderIds
function printAllOrderIds() {
    console.log("Order IDs:", Array.from(orderIds).join(', '));
}


const products1 = [
    { productId: 1, productName: "Product A", productQuantity: 2, price: 50 },
    { productId: 2, productName: "Product B", productQuantity: 1, price: 100 }
];

const products2 = [
    { productId: 3, productName: "Product C", productQuantity: 4, price: 25 },
    { productId: 4, productName: "Product D", productQuantity: 3, price: 75 }
];

addOrder(products1);
addOrder(products2); 

// Print all order IDs
// console.log(orderDetails);
// console.log(orderIds);
// printAllOrderIds();

// Update an order
const orderIdToUpdate = orderIds.values().next().value;
updateOrder(orderIdToUpdate, [
    { productId: 1, productName: "Product A", productQuantity: 0, price: 50 },
    { productId: 2, productName: "Product B", productQuantity: 0, price: 100 }
]);

// Get the order with the maximum total value
console.log("Order with max value:", getMaxValueOrder());

// printAllOrderIds();
