var mysql = require("mysql2");
var inquirer = require("inquirer");

// create the connection information for the sql database

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id" + connection.threadId + "\n");
	managerChoices();
});


function managerChoices () {
	inquirer.prompt([
	{ 
		type: "list",
		name: "managerChoices",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

	}]).then(function(answer) {
		userChoice = answer.managerChoices;
		switch (userChoice) {
			case "View Products for Sale":
				productOnSale();
			break;

			case "View Low Inventory":
				lowInventory();
			break;

			case "Add to Inventory":
				addInventory();
			break;	

			case "Add New Product":
				addNewProduct();	
			break;

		};

	});
};

function productOnSale () {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		//console.log(res);
		for (let i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Cost: $" + res[i].price + " || Stock: " + res[i].stock_quantity);
		}
		 if (userChoice === "View Products for Sale") {
		 	doneReviewing();
		 }
	});
};

function doneReviewing() {
	inquirer.prompt([
	{
		type: "Confirm",
		name: "Reviewing",
		message: "Are you done Reviewing? (y/n)"

	}]).then(function(answer) {
		if (answer.Reviewing === 'y') {
			managerChoices();

		}
		else if (answer.Reviewing ==='n') {
			doneReviewing();
		}
		else {
			console.log("Not valid answer");
			doneReviewing();

		}

	});
};

function lowInventory () {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
		if (err) throw err;
		for (let i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Cost: $" + res[i].price + " || Stock: " + res[i].stock_quantity);
		}
		doneReviewing();
	});
};

function addInventory() {
	productOnSale();
	inquirer.prompt([
{
	type: "input",
	name: "itemToEdit",
	message: "Which item are you adding to Stock?"

},

{
	type: "input",
	name: "itemToAdd",
	message: "How much are you adding to Stock?"

}]).then(function(answer) {
	//console.log(answer);
    connection.query("SELECT * FROM products WHERE item_id=?",[+answer.itemToEdit], function(err, res) {
      if (err) throw err;
     // console.log(res);
      let currentStock = res[0].stock_quantity;
      let newStock = +answer.itemToAdd + +currentStock;
      connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[newStock, +answer.itemToEdit], function(err, res) {
        if (err) throw err;
        console.log("Quantity has been updated.");
        managerChoices();

		});
	});

});

};

function addNewProduct() {
	inquirer.prompt([

{
	type: "input",
	name: "product_name",
	message: "What product would you like to add?"

},

{
	type: "input",
	name: "department_name",
	message: "What department would you like to put it Under?"

},

{
	type: "input",
	name: "price",
	message: "What is the cost of this product?"

},

{
	type: "input",
	name: "stock_quantity",
	message: "How many do you have in stock?"

	}]).then(function(answer) {

		let name = answer.product_name;
		let department = answer.department_name;
		let price = answer.price;
		let stock = answer.stock_quantity;
		connection.query("INSERT INTO products SET product_name=?, department_name=?, price=?, stock_quantity=?",[name, department, +price, +stock], function(err, res) {
			if (err) throw err;
			console.log("Your item has been added.");
			managerChoices();
		
	});

		
	});
	
	
};




