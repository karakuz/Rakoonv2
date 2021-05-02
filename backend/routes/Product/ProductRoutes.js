const express = require("express");
const router = express.Router();
const Product = require("../../models/item");
const db = require("../../config/database");

router.get("/product/:id", async (req, res) => {
    var product = await Product.findOne({ where: { item_id: req.params.id } });
    if (product === null || product === undefined) {
        res.sendStatus(404);
    }
    else {
        res.send(product.toJSON());
    }
});

router.get("/products", async (req, res) => {
  let all_products = await db.get(`SELECT *, 0 as rate FROM items`);
  let map = new Map();
  for(let product of all_products)
    map.set(product.item_id, {...product});
  
  const rated_products = await db.get(`
    SELECT item_id, item_name, price, image, AVG(rate) as rate FROM 
    (SELECT 
      items.*,
      rate,
      is_verified
    FROM rakoon.items RIGHT JOIN ratings ON items.item_id=ratings.item_id
    ) AS J
  WHERE is_verified = 1
  `);
  
  for(let product of rated_products)
    map.set(product.item_id, product);
  
    console.log(Array.from(map.values()));
  res.send(Array.from(map.values()));
})

router.post("/addComment", async (req, res) => {
  const data = req.body.data;

  await db.get(`INSERT INTO ratings(item_id,store_id,user_id,comment,rate,is_verified,date) VALUES(
    ${data.productID}, (
        SELECT store_id FROM rakoon.items WHERE item_id=${data.productID}
    ),${data.user_id}, '${data.comment}', ${data.rate}, ${0}, '${data.date}'
  )`);
  res.send("done");
})

module.exports = router;