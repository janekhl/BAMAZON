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
  displayProducts();
});

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
function options(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer
        .prompt([
        {
            name: "item_id",
            type: "input",
            message: "What is the ID of the item you would like to purchase?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many of this item would you like to purchase?"
        }
    ])
    .then(function(answer) {
        var item =parseInt(answer.item_id);
        var stock = (res[item-1].stock_quantity);
        if (answer.quantity<=stock){
            console.log("This transaction is okay!")
            newQuantity= stock-answer.quantity
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: newQuantity
                  },
                  {
                    item_id: item
                  }
                ]
            );
            console.log("Your total is: " + res[item-1].price*answer.quantity + "!!!!! Thank you for your business!");
            inquirer
            .prompt([
            {
                name: "continue",
                type: "confirm",
                message: "Would you like to purchase something else?"
            }
            ])
            .then(function(answer){
                if (answer.continue){
                    setTimeout(function(){ displayProducts(); }, 3000); 
                }
                else{
                    console.log("Thank you! Please come again!")
                    connection.end();
                }
            });
        }
        else{
            console.log("Not enough product left in stock. Please try again!");
            setTimeout(function(){ displayProducts(); }, 3000);
        }
        });
    });
}