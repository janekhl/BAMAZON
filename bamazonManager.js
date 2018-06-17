var mysql = require("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 8889,

  user: "root",

  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    options();
  });

function options() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Display all products for sale",
          "Display products we are running low on",
          "Add to inventory",
          "Add new product"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "Display all products for sale":
          displayProducts();
          break;
  
        case "Display products we are running low on":
          displayLowInventory();
          break;
  
        case "Add to inventory":
          addInventory();
          break;
  
        case "Add new product":
          addProduct();
          break;
        }
      });
  }

function displayProducts() {
    console.log("Displaying all products on BAMazon...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      for (var i=0; i<res.length; i++){
        console.log("Product ID: " + res[i].item_id + " | Product: " + res[i].product_name + " | Department: " + res[i].department_name + " | Price: " + res[i].price + " | Quantity Left: " + res[i].stock_quantity + "\r" );
      }
      console.log("\r");
      setTimeout(function(){ options(); }, 3000);
    });
}

function displayLowInventory(){
    console.log("You're running low on the following...\n");
    var query = "SELECT product_name FROM products WHERE stock_quantity < 3";
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].product_name);
      }
      options();
    });
  }

function addInventory() {
    console.log("Adding a new product...\n");
    inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "What item would you like to add?"
      },
      {
        name: "department_name",
        type: "input",
        message: "What department would you like to place your item in?"
      },
      {
        name: "price",
        type: "input",
        message: "How much will you charge for this item?",
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "How much of this item is available?",
      }
    ])
    .then(function(answer) {
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.product_name,
        price: answer.price,
        department_name: answer.department_name,
        stock_quantity: answer.stock_quantity
      },
      function(err, res) {
        console.log(res.affectedRows + " product inserted!\n");

      }
    );
      console.log(query.sql);
      options()
  });
}

function addInventory() {
    console.log("Updating product\n");
    inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "What item would you like to update?"
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "How much of this item are you adding?",
      }
    ]).then(function(answer) {
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: stock_quantity+answer.stock_quantity
        },
        {
          product_name: product_name
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
      }
    );
});
  
    // logs the actual query being run
    console.log(query.sql);
}
