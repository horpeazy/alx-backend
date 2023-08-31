const express = require("express");
const { createClient } = require("redis");
const { promisify } = require("util");


const listProducts = [
  {
    itemId: 1,
    itemName: "Suitcase 250",
    price: 50,
    initialAvailableQuantity: 4
  },
  {
    itemId: 2,
    itemName: "Suitcase 450",
    price: 100,
    initialAvailableQuantity: 10
  },
  {
    itemId: 3,
    itemName: "Suitcase 650",
    price: 350,
    intialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: "Suitcase 1050",
    price: 550,
    initialAvailableQuantity: 5
  }
];

const getItemById = (id) => {
  const item = listProducts.find(product => product.itemId === id);
  if(item) return item;
}

const app = express();
const port = 1245;
const redisClient = createClient();

const reserveStockById = (itemId, stock) => {
  return promisify(redisClient.set)
           .bind(redisClient)(`item.${itemId}`, stock);
}

const getCurrentReservedStockById = (itemId) => {
  return promisify(redisClient.get)
	   .bind(redisClient)(`item.${itemId}`)
};

app.get("/list_products", (req, res) => {
  res.status(200).json(listProducts);
});

app.get("/list_products/:itemId", async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const product = getItemById(itemId);
  if(!product) {
    return res.status(404).json({"status": "Product not found"});
  }
  const result = await getCurrentReservedStockById(itemId);
  const availableStock = Number.parseInt(result || 0);
  product.currentQuantity = product.initialAvailableQuantity - availableStock;
  return res.status(200).json(product);
})

app.get("/reserve_product/:itemId", async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const product = getItemById(itemId);
  if(!product) {
    return res.status(404).json({"status": "Product not found"});
  }
  const result = await getCurrentReservedStockById(itemId);
  const availableStock = Number.parseInt(result || 0);
  if(availableStock >= product.initialAvailableQuantity) {
    res.status(404)
       .json({"status": "Not enough stock available", "itemId": product.itemId});
    return;
  } else {
    await reserveStockById(product.itemId, availableStock + 1);
    return res.status(200)
	      .json({"status": "Reservation confirmed", "itemId": product.itemId});
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
