const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const cors = require('cors');
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "shopping_cart"
});

con.connect(function(err) {
    if (err) 
        console.log( err.message );
    else
        console.log("Connected!"); 
});

//  Allow CORS
var corsOptions = 
server.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 
  }));

//  BodyParser for POST support
server.use( bodyParser.json() );


//  End Points
server.post('/api/addProduct', (req, res) => {

    product = req.body;
    if(product.name!=undefined) {
        var sql = `INSERT INTO products (name, categoryId, price, imageUrl) VALUES ('${product.name}', '${product.categoryId}', '${product.price}', '${product.imageUrl}')`;

        con.query(sql, (err, result, fields) => {
            if(!err) {
                product.id = result.insertId;
                res.send({success: true, data: product});

            } else {

                res.send({success: false, err: 'could not read products from database' });
            }
        });
    }
    else
        res.send({success: false, err: 'product name is missing'});
});

server.post('/api/updateProduct', (req, res) => {

    let product = req.body;

    let sql = `UPDATE products SET name='${product.name}', 
               categoryId='${product.categoryId}', 
               price='${product.price}', 
               image_name='${product.image_name}' 
               WHERE id = '${product.id}'`;

        con.query(sql, function (err, result, fields) {

            if(!err) {

                res.send({ success:true});
                
            } else {

                res.send({
                    success: false,
                    err: 'Could not update products'
                });
            }
         });
});

server.get('/api/getProduct/:id', (req, res) => {
    
    var productID = req.params.id;
    
    if(!productID) {
        
        //  Error, missing product id
        
        res.send({
            success: false,
            err: 'Product ID is missing or invalid'
        });
        
    } else {
     
        //  Look for product in db
        let sql = `SELECT * FROM products WHERE id = '${productID}'`;
        
        con.query(sql, function (err, result, fields) {
            
            if(!err) {
                
                if(result!='') {
                    
                    //  Product found - Send it
                    res.send({
                        success: true,
                        data: result[0]
                    });
                    
                } else {
                    
                    //  Product not found
                    res.send({
                        success: false,
                        err: 'Product not found'
                    });
                }

            } else {
             
                //  There was an sql error
                res.send({
                    success: false,
                    err: 'Could not read from products table'
                });
            }
        });
    }
});

server.get('/api/getProducts', (req, res) => {

    con.query("SELECT * FROM products", function (err, result, fields)          
    {
        if (!err){   
            res.send({success: true, data: result });
        }
        else
            res.send({success:false, err: 'could not read products from database'})    
    });
});
server.get('/api/getProducts/:keyword', (req, res) => {

    var keyword = req.params.keyword;

    con.query(`SELECT * FROM products WHERE name LIKE('%${keyword}%')`, function (err, result, fields)
    {
        if (!err){
            res.send({success: true, data: result});
        }
        else
            res.send({success: false, err: 'could not access products table' });
    });
});

server.get('/api/getProductsByCategory/:categoryid', (req, res) => {

    var categoryid = req.params.categoryid;

    con.query(`SELECT * FROM products WHERE categoryId ='${categoryid}'`, function (err, result, fields)
    {
        if (!err){
            res.send({success: true, data: result});
        }
        else
            res.send({success: false, err: 'could not access products table' }); 
    });
});


server.post('/api/addCategory', (req, res) => {

    category = req.body;

    if(category.name != undefined) {
        
       let sql = `INSERT INTO categories (name) 
                  VALUES('${category.name}') 
                 `;
        
        con.query(sql, (err, result) => {
            
            if(!err) {
                
                //  Category added successfully - return category object with insert Id
                category.id = result.insertId;
                res.send({
                    success: true,
                    data: category
                });
            } else {
                res.send({
                    success: false,
                    err: 'Could insert into categories table'
                });
            }
            
        });
        
    } else {
        
        // Missing Details
        
        res.send({
            success: false,
            err: 'Category name is missing'
        });   
    }
 
});

server.post('/api/updateCategory', (req, res) => {

    let category = req.body;

    if(category.name != undefined) {

        con.query(`UPDATE categories SET name='${category.name}' WHERE id = '${category.id}'`
        , function (err, result, fields) {
            if(!err) {
                res.send({ success:true});
            }
            else {
                res.send({
                    success: false,
                    err: 'Could not update cateogries db'
                });
            }
            
        });
    } else {
        res.send({
            success: false,
            err: 'Category name is missing'
        });
    }
});
server.get('/api/getCategory/:id', (req, res) => {

    var categoryID = req.params.id;

    if(!categoryID){

        res.send({
            success: false,
            err: 'category ID is missing or invalid'
        });
    }else{

        let sql = `SELECT * FROM categories WHERE id = '${categoryID}'`;
        con.query(sql, function (err, result, fields) {
            if(!err) {
                
                if(result) {
                    
                    res.send({
                        success: true,
                        data: result[0]
                    });
                    
                } else {
                    
                    //  Category not found
                    res.send({
                        success: false,
                        err: 'Category not found'
                    });
                }
             } else {
             
                //  There was an sql error
                res.send({
                    success: false,
                    err: 'Could not read from category table'
                });
            }
        });
    }

});
server.get('/api/getCategories', (req, res) => {

    con.query("SELECT * FROM categories", function (err, result, fields)
    {
        if(!err){
            res.send({
                success:true,
                data: result});
        }else
            res.send({
                success:false, 
                err: 'could not read categories from database'})
    });
});
server.post('/api/addUser', (req, res) => {

    user = req.body;

    if(user.email!=undefined){

        var sql = `INSERT INTO users (email, password, role) 
                   VALUES ('${user.email}',
                           '${user.password}', 
                           '${user.role}')`;

        con.query(sql, (err, result, fields) => {
            if(!err) {
                user.id = result.insertId;
                res.send({
                    success: true,
                    data: ({id: user.id})});
            } else {
                res.send({
                    success: false, 
                    err: 'could not insert user to database' });
            }
        });
    }else
        res.send({
            success: false, 
            err: 'user email is missing'});    
});
server.post('/api/updateUser', (req, res) => {

    let user = req.body;

    con.query(`UPDATE users SET email='${user.email}', password='${user.password}', role='${user.role}' WHERE id = '${user.id}'`
     , function (err, result, fields) {
        if (result.affectedRows!=0) {
            res.send({ success:true});
        }
        else
            res.send( {success: false, err: 'Please check the user details' });
     });


});
server.get('/api/getUser/:id', (req, res) => {

    var userID = req.params.id;

    if(!userID) {
        
        //  Error, missing user id
        
        res.send({
            success: false,
            err: 'User ID is missing or invalid'
        });
        
    } else {
     
        //  Look for users in db
        let sql = `SELECT * FROM users WHERE id = '${userID}'`;
        
        con.query(sql, function (err, result, fields) {
            
            if(!err) {
                
                if(result!='') {
                    
                    //  User found - Send it
                    res.send({
                        success: true,
                        data: result[0]
                    });
                    
                } else {
                    
                    //  User not found
                    res.send({
                        success: false,
                        err: 'User not found'
                    });
                }
             } else {
             
                //  There was an sql error
                res.send({
                    success: false,
                    err: 'Could not read from users table'
                });
            }
        });
    }
});
server.post('/api/addCustomer', (req, res) => {

    let customer = req.body;

    if(customer.email!=undefined){

        //  Check if email already exists
        var sql = `SELECT id FROM users WHERE email = '${customer.email}'`;

        con.query(sql, (err, result) => {
            if(!err) {

                if(result.length) {

                    //  Email address already registred

                    res.send({
                        success: false,
                        err: 'Your email address is already registered'
                    })
                } else {

                    //  Add new customer
                    var sql = `INSERT INTO users (fullname , email, password, address, city) 
                    VALUES (
                     '${customer.fullname}',
                     '${customer.email}', 
                     '${customer.password}',
                     '${customer.address}',
                     '${customer.city}'
                    )`;
 
                    con.query(sql, (err, result, fields) => {
                        if(!err) {
                            customer.id = result.insertId;
                            res.send({
                                success: true,
                                data: ({id: customer.id})});
            
                        } else {
                            res.send({
                                success: false, 
                                err: 'could not add customer to database',
                                q: err.message
                             });
                        }
                    });
                }
            }
        })
    } else
        res.send({
            success: false, 
            err: "customer email is missing"
        });
});
server.post('/api/updateCustomer', (req, res) => {

    let customer = req.body;

    con.query(`UPDATE customers SET firstName='${customer.firstName}', lastName='${customer.lastName}', email='${customer.email}', officialID='${customer.officialID}', password='${customer.password}' WHERE id = '${customer.id}'`
     , function (err, result, fields) {
        if (result.affectedRows!=0) {
            res.send({ success:true});
        }
        else
            res.send( {success: false, err: 'Please check the product details' });
     });
});
server.get('/api/getCustomers', (req, res) => {

    con.query("SELECT * FROM customers", function (err, result, fields)
    {
        if (!err){   
            res.send({
                success: true, 
                data: result });
        }
        else
            res.send({
                success:false, 
                err: 'could not read customers from database'})    
    });
});
server.get('/api/getCustomer/:id', (req, res) => {

    var customerID = req.params.id;
    if(customerID) {
        let sql = `SELECT * FROM customers WHERE id = '${customerID}'`;
        con.query(sql, function (err, result, fields)
        {
            if(!err){
                if(result!=''){
                    res.send({
                        success:true,
                        data: result[0]});
                }else
                    res.send({
                        success:false, 
                        err: 'customer not found'});
            }else
                res.send({
                    success:false, 
                    err: 'Could not read from customers table'
                });           
        });
    }else{
        res.send({
            success: false,
            err: 'Customer ID is missing or invalid'
        });
    }

});

server.post('/api/cart/create', (req, res) => {

    cart = req.body;
    if(cart.customerId!=undefined){

        var sql = `INSERT INTO carts (customerId ) VALUES ('${cart.customerId}')`;

        con.query(sql, (err, result) => {
            if(!err) {

                cart.id = result.insertId;
                res.send({
                    success: true, 
                    data: cart});

            } else {
                res.send({
                    success: false, 
                    err: 'could not create a new cart in database' });
            }
        });

    } else {
        res.send({
            success: false, 
            err: 'customerId in this cart is missing'});
    }
 
});

server.post('/api/cart/upsertProduct', (req, res) => {

    cartItem = req.body;

    if(cartItem.cartId && cartItem.productId) {

        var sql = `DELETE FROM cart_items 
                   WHERE cartId = '${cartItem.cartId}' AND productId = '${cartItem.productId};'
                  `;

        con.query(sql, (err) => {
            if(!err){

                var sql = `INSERT INTO cart_items (cartId, productId, qty) 
                VALUES (
                    '${cartItem.cartId}', 
                    '${cartItem.productId}', 
                    '${cartItem.qty}'
                )`;     

                con.query(sql, (err, result) => {
                    if(!err) {
                        
                        res.send({success: true});

                    } else {
                        res.send({
                            success: false, 
                            err: 'could not update cartItems'
                        });
                    }
                });

            } else {
                res.send({
                    success: false,
                    err: 'could not delete from cartItems'
                });
            }
        });
    }   
    else
        res.send({
            success: false, 
            err: 'productID and cartId is missing'});    
});

server.post('/api/cart/removeProduct', (req, res) => {

    var obj = req.body;

    con.query(`DELETE FROM cart_items WHERE cartId = '${obj.cartId}' AND productId = '${obj.productId}'`, function (err, result, fields) {

        if(!err) {
            res.send({success: true});
        }
        else
            res.send({
                success: false,
                err: 'Please check the cart details' });
    });
        
});
server.get('/api/cart/getCart/:id', (req, res) => {

    var cartID = req.params.id;
    if(!cartID) {
        
        //  Error, missing cart id
        
        res.send({
            success: false,
            err: 'Cart ID is missing or invalid'
        });
        
    } else {
     
        //  Look for cart in db
        let sql = `SELECT * FROM carts WHERE id = '${cartID}'`;
        
        con.query(sql, function (err, result, fields) {
            
            if(!err) {
                
                if(result!='') {
                    

                    //  Create cart object
                    let data = {
                        id: cartID,
                        customerId: result['customerId'],
                        products: []
                    }

                    //  Assigned cart products
                    let sql = `SELECT products.name AS name, products.id AS id, products.price AS price, cart_items.qty AS qty 
                               FROM cart_items, products
                               WHERE cart_items.productId = products.id
                               AND cart_items.cartId='${cartID}'`;

                    con.query(sql, function (err, result, fields) {
                        if(!err) {

                            data.products = result;

                            //  cart found - Send it
                            res.send({
                                success: true,
                                data: data
                            });
                        } else {
                            //  mysql error
                            res.send({
                                success: false,
                                err: 'Could not access cart_products table'
                            });
                        }
                    });

                } else {
                    
                        //  cart not found
                        res.send({
                            success: false,
                            err: 'Cart not found'
                        });
                }

            } else {
             
                //  There was an sql error
                res.send({
                    success: false,
                    err: 'Could not read from carts table'
                });
            }
        });
    }
});
server.post('/api/order/create', (req, res) => {

    order = req.body;

    if(order.cartId!=undefined){

        var sql = `INSERT INTO orders 
        (cartId, delivery_city, delivery_address, delivery_time, list4Digits) 
        VALUES (
            '${order.cartId}', 
            '${order.delivery_city}', 
            '${order.delivery_address}', 
            '${order.delivery_time}', 
            '${order.list4Digits}'
        )`;

        con.query(sql, (err, result, fields) => {
            if(!err) {
                order.id = result.insertId;
                res.send({
                    success: true ,
                    data: order});
            } else {
                res.send({
                    success: false, 
                    err: 'could not insert order to database' });
            }
        });
    }else
        res.send({
            success: false, 
            err: "order's cartID is missing"});
});
server.get('/api/order/getOrder/:id', (req, res) => {

    var orderID = req.params.id;
    if(!orderID) {
        
        //  Error, missing order id
        
        res.send({
            success: false,
            err: 'Order ID is missing or invalid'
        });
        
    } else {
     
        //  Look for order in db
        let sql = `SELECT * FROM orders WHERE id = '${orderID}'`;
        
        con.query(sql, function (err, result, fields) {
            
            if(!err) {
                
                if(result!='') {
                    
                    //  Order found - Send it
                    res.send({
                        success: true,
                        data: result[0]
                    });
                    
                } else {
                    
                    //  Order not found
                    res.send({
                        success: false,
                        err: 'Order not found'
                    });
                }

            } else {
             
                //  There was an sql error
                res.send({
                    success: false,
                    err: 'Could not read from orders table'
                });
            }
        });
    }
});
server.get('/api/order/getOrders', (req, res) => {

    con.query("SELECT * FROM orders", function (err, result, fields)
    {
        if (!err){   
            res.send({
                success: true, 
                data: result });
        }
        else
            res.send({
                success:false, 
                err: 'could not read orders from database'})    
    });
});

//  --- Authentication ----------------/

server.post('/api/customer/auth', (req, res) => {
    
        let credentials = req.body;
    
        if(credentials.email != undefined && credentials.password != undefined) {
    
            con.query(`SELECT id, email, role, fullname FROM users WHERE email='${credentials.email}' AND password = '${credentials.password}'`
            , function (err, result) {
                if(!err) {
                    if(result.length) 
                        res.send({ success:true, e: 'e', data: result[0] });
                    else
                        res.send({
                            success: false,
                            err: 'Invalid email or password '
                        });
                }
                else {
                    res.send({
                        success: false,
                        err: 'Invalid email or password '
                    });
                }
                
            });
        } else {
            res.send({
                success: false,
                err: 'Login credentials are missing'
            });
        }
    });

    server.get('/api/stats', (req, res) => {

            let statsData = {
                totalOrders: 0,
                totalProducts: 0
            }
        
            con.query("SELECT COUNT(id) AS totalOrders FROM orders", function (err, result) {
                if(!err){

                    statsData.totalOrders = result[0].totalOrders;
                    
                    con.query("SELECT COUNT(id) AS totalProducts FROM products", function (err, result) {
                        
                        if(!err) {
                            statsData.totalProducts = result[0].totalProducts;
                            res.send({
                                success: true,
                                data: statsData
                            })
                        } else {
                            res.send({
                                success:false, 
                                err: 'could not read products stats from database'
                            })
                        }
                    })

                } else {
                    res.send({
                        success:false, 
                        err: 'could not read order stats from database'
                    })
                }
            })
    })

    server.post('/api/user/getLastOpenCart', (req, res) => {

        let userId = req.body.userId;
        let sql = `SELECT carts.id AS id, COUNT(cart_items.productId) AS count
                    FROM carts
                    RIGHT JOIN cart_items ON carts.id = cart_items.cartId 
                    WHERE customerId = '${userId}' 
                    AND NOT completed 
                    GROUP BY id
                    HAVING count > 0
                    ORDER BY id DESC`;

        con.query(sql, function(err, result){
            if(!err) {

                if(result.length) {
                    res.send({
                        success: true,
                        data: {
                            cartId: result[0].id
                        }
                    })
                } else {
                    res.send({
                        success: false,
                        err: 'No open cart found'
                    })
                }
                
            } else {
                res.send({
                    success: false,
                    err: 'There was a problem accessing the carts table'
                })
            }
        })

    })

server.listen(4000, function(err) {
    if(err) {
        console.log('coud not start server: ' + err.message);
    } else 
        console.log('server started');
})