const keySecret = "sk_test_CXosaxEOHMENrsmMbwBvGU5Q";
var express = require('express');
var router = express.Router();
const stripe = require("stripe")(keySecret);


// var dataCardBike = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  // req.session.dataCardBike = []
  // cette variable session est desactivée puisque elle est rappelée en ligne 20
  var dataBike = [
                    {name: "Model BIKO45", url:"/images/bike-1.jpg", price: 35},
                    {name: "Model ZOOK7", url:"/images/bike-2.jpg", price: 799},
                    {name: "Model LIKO89", url:"/images/bike-3.jpg", price: 839},
                    {name: "Model GEWO", url:"/images/bike-4.jpg", price: 1206},
                    {name: "Model TITAN5", url:"/images/bike-5.jpg", price: 989},
                    {name: "Model AMIG39", url:"/images/bike-6.jpg", price: 599}
];

if (req.session.dataCardBike == undefined) {
req.session.dataCardBike = [];
}

  res.render('index', {dataBike: dataBike});
});

router.post('/add-card', function(req, res, next) {
  console.log(req.body);

  var isUpdate = false;
  for(var i=0; i<req.session.dataCardBike.length; i++) {
    if (req.session.dataCardBike[i].name == req.body.name){
    req.session.dataCardBike[i].quantity++;
    isUpdate = true;
    }
}

   if (isUpdate == false){
    req.session.dataCardBike.push(req.body)
  }

  res.render('card', { dataCardBike:req.session.dataCardBike });
})

router.post('/update-card', function(req, res, next) {
  console.log(req.body);
  req.session.dataCardBike[req.body.position].quantity = req.body.quantity;
  res.render('card', { dataCardBike:req.session.dataCardBike });
})

router.get('/delete-card', function(req, res, next) {
  console.log(req.body);
  req.session.dataCardBike.splice(req.query.position, 1);
  res.render('card', { dataCardBike:req.session.dataCardBike });
})

router.get('/card', function(req, res, next) {
  res.render('card', { dataCardBike:req.session.dataCardBike });
});

router.post("/checkout", (req, res) => {

  var totalCmd = 0;
  for(var i=0; i<req.session.dataCardBike.length; i++) {
    totalCmd = totalCmd + (req.session.dataCardBike[i].price * req.session.dataCardBike[i].quantity);
  }
  totalCmd = totalCmd * 100;


    stripe.charges.create({
      amount:totalCmd,
      description: "Sample Charge",
      currency: "eur",
      source: req.body.stripeToken
    })
   res.render("cmd-confirm");
});


module.exports = router;
