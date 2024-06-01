import express, { query } from "express";
import bodyParser from "body-parser";
const app = express();
const port = process.env.PORT || 3000;
const ok = 200;
const created=201
const not_found = 404;
const no_content = 204;
const products = [
  { id: 1, title: "tomato" },
  { id: 2, title: "orange" },
];
const addresses = [
  { id: 1, address: "komitas=41/57" },
  { id: 2, address: "komitas=1" },
];
const parserMiddleware= bodyParser({})
app.use(parserMiddleware)
app.get("/", (req, res) => {
  res.send("hello-welcome" + "i made-it");
});
app.put('/products/:id',(req,res)=>{
let product= products.find(p=>p.id=== +req.params.id)
if(product){
  product.title=req.body.title
  res.json(product)
}res.sendStatus(404)
})
app.post('/address',(req,res)=>{
  let newAddress={
    id: +(new Date()),
    address:req.body.address,
  }
  addresses.push(newAddress)
  res.status(201) .send(newAddress)
})
app.get('/products/:id',(req,res)=>{
  let product=products.find(p=>p.id=== +req.params.id)
  if(product){
    res.json(product)
  return
  }return res.sendStatus(404)
  
})
app.get("/products", (req, res) => {
  if (req.query.title) {
    let serchIndexOf = req.query.title.toString();
    res.json(products.filter((p) => p.title.indexOf(serchIndexOf) > -1));
  }
  res.json(products);
});

app.get("/products/tomato", (req, res) => {
  let tomato = products.find((p) => p.title === "tomato");
  if (!tomato) {
    res.sendStatus(not_found);
  }
  res.json(tomato);
  return;
});
app.get("/products/:productTitle", (req, res) => {
  let product = products.find((p) => p.title === req.params.productTitle);

  if (!product) {
    res.sendStatus(not_found);
  }
  res.json(product);
  return;
});

app.get("/address", (req, res) => {
  res.json(addresses);
  return;
});
app.get("/address/:id", (req, res) => {
  let address = addresses.find((p) => p.id === +req.params.id);
  if (address) {
    res.json(address);
  }
  return res.sendStatus(not_found);
});

app.delete("/products/:id", (req, res) => {
  for (let i = 0; i < products.length; i++) {
    let parId=+req.params.id
    if (products[i].id === parId ) {
      products.splice(i, 1);
      res.sendStatus(no_content);
      return;
    }
  res.sendStatus(404)
  }
  
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
