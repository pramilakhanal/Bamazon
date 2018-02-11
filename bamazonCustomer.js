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
	toPurchase();
});

function toPurchase() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
		for (let i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Cost: $" + res[i].price);
		};
		inquirer.prompt([
		{

			type: "input",
			name: "purchaseItem",
			message: "What is the ID of the item you would like to purchase?"

		},
		{
			type: "input",
			name: "purchaseNumber",
			message: "How many would you like to purchase?"

		}
		]).then(function(answer) {
				inStock(answer.purchaseNumber, answer.purchaseItem);

		});
	
	});

};

function inStock (itemNum, itemID) {
	connection.query("SELECT * FROM products WHERE item_id=? ",[itemID], function(err, res) {
		if (err) throw err;
		if(itemNum <= res[0].stock_quantity) {
		let totalBill = itemNum * res[0].price;
		let newStock = res[0].stock_quantity - itemNum;

		console.log("Your purchase has gone through. The total bill was: $" + totalBill);
		connection.query("Update products SET stock_quantity=?, product_sales=? Where item_id=?", [newStock, totalBill, itemID], function(err, res) {
			if (err) throw err;
			setTimeout(()=>{toPurchase()}, 1000);
		});
		
	}
	else {
		console.log("Out of Stock. Please try to purchase different product or select less.");
		toPurchase();
	};

});

};


