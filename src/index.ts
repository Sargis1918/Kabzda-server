import express from "express";
import bodyParser from "body-parser";

export const app = express();
const port = process.env.PORT || 5001;

export const HTTP_STATUSES = {
    ok_200: 200,
    created_201: 201,
    no_content_204: 204,
    bad_request_400: 400,
    
    not_found_404: 404,
};

let db = {
    products: [
        { id: 1, title: "tomato" },
        { id: 2, title: "orange" },
    ],
    addresses: [
        { id: 1, titlе: "komitas=41/57" },
        { id: 2, title: "komitas=1" },
    ],
};

const parserMiddleware = bodyParser.json();
app.use(parserMiddleware);

app.delete("/__test__/data", (req, res) => {
    console.log("Received request on /test");
    db.products=[],db.addresses=[]
    res.sendStatus(HTTP_STATUSES.no_content_204);
});

app.get("/", (req, res) => {
    
    
    res.json(db);
});

app.put('/products/:id', (req, res) => {
    let product = db.products.find(p => p.id === +req.params.id);
    if (product) {
        if (!req.body.title) {
          return res.status(HTTP_STATUSES.bad_request_400);
        }
        product.title = req.body.title;
        res.status(HTTP_STATUSES.ok_200).json(product);
      } else {
        res.sendStatus(HTTP_STATUSES.not_found_404);
      }
    });

app.post('/address', (req, res) => {
    if(!req.body.title){
        res.sendStatus(HTTP_STATUSES.bad_request_400)
    return;
    }
    let newAddress = {
        id: +(new Date()),
        title: req.body.title,
    };
   
    db.addresses.push(newAddress);
    res.sendStatus(HTTP_STATUSES.created_201).json(newAddress);
});

app.get('/products/:id', (req, res) => {
    let product = db.products.find(p => p.id === +req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.sendStatus(HTTP_STATUSES.not_found_404);
    }
});

app.get("/products", (req, res) => {
    if (req.query.title) {
        let searchIndexOf = req.query.title.toString();
        res.json(db.products.filter((p) => p.title.indexOf(searchIndexOf) > -1));
    } else {
        res.json(db.products);
    }
});

app.get("/products/tomato", (req, res) => {
    let tomato = db.products.find((p) => p.title === "tomato");
    if (!tomato) {
        res.sendStatus(HTTP_STATUSES.not_found_404);
    } else {
        res.json(tomato);
    }
});

app.get("/products/:productTitle", (req, res) => {
    let product = db.products.find((p) => p.title === req.params.productTitle);
    if (!product) {
        res.sendStatus(HTTP_STATUSES.not_found_404);
    } else {
        res.json(product);
    }
});

app.get("/address", (req, res) => {
    res.json(db.addresses);
});

app.get("/address/:id", (req, res) => {
    let address = db.addresses.find((p) => p.id === +req.params.id);
    if (address) {
        res.json(address);
    } else {
        res.sendStatus(HTTP_STATUSES.not_found_404);
    }
});

app.delete("/products/:id", (req, res) => {
    for (let i = 0; i < db.products.length; i++) {
        let parId = +req.params.id;
        if (db.products[i].id === parId) {
            db.products.splice(i, 1);
            res.sendStatus(HTTP_STATUSES.no_content_204);
            return;
        }
    }
    res.sendStatus(HTTP_STATUSES.not_found_404);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
