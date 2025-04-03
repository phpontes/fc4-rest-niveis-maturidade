# Curso REST

## Exemplo REST meia boca para E-commerce

| Operação                                      | Método HTTP | Path                                           |
|-----------------------------------------------|-------------|------------------------------------------------|
| JWT login                                     | POST        | /jwt/login                                     |
| Session login                                 | POST        | /session/login                                 |
| Session logout                                | POST        | /session/logout                                |
| Create a customer                             | POST        | /customers/createCustomer                      |
| Get a customer by ID                          | GET         | /admin/customers/getCustomerById               |
| List customers with pagination                | GET         | /admin/customers/listCustomers                 |
| Update a customer                             | POST        | /admin/customers/updateCustomer                |
| Delete a customer                             | POST        | /admin/customers/deleteCustomer                |
| Create a category                             | POST        | /admin/categories/createCategory               |
| Get a category by slug                        | GET         | /categories/getCategoryBySlug                  |
| List categories with pagination               | GET         | /categories/listCategories                     |
| List categories in admin with pagination      | GET         | /admin/categories/listCategories               |
| Update a category                             | POST        | /admin/categories/updateCategory               |
| Delete a category                             | POST        | /admin/categories/deleteCategory               |
| Create a product                              | POST        | /admin/products/createProduct                  |
| Get a product by ID                           | GET         | /admin/products/getProductById                 |
| Get a product by slug                         | GET         | /products/getProductBySlug                     |
| Update a product                              | POST        | /admin/products/updateProduct                  |
| Delete a product                              | POST        | /admin/products/deleteProduct                  |
| List products with pagination                 | GET         | /products/listProducts                         |
| List products in admin with pagination        | GET         | /admin/products/listProducts                   |
| Get CSV of products                           | GET         | /admin/products/listProducts.csv               |
| Add an item to the cart                       | POST        | /carts/addItemToCart                           |
| Get a cart by ID                              | GET         | /carts/getCart                                 |
| Remove an item from the cart                  | POST        | /carts/removeItemFromCart                      |
| Clear the cart                                | POST        | /carts/clearCart                               |
| Create an order                               | POST        | /orders/createOrder                            |
| List orders with pagination                   | GET         | /orders/listOrders                             |

# Exemplo de Level 0

## RPC Style - JSON

### Criar um customer
```http
POST /customers HTTP/1.1

{
    "call": "create",
    "data": {
        "name": "John Doe",
        "email": "user@customer.com",
        "phone": "1234567890"
        "address": {
            "street": "1234 Main St",
            "city": "Springfield",
            "state": "IL",
            "zip": "62701"
        }
    }

}
```

### Pegar um customer
```http
POST /customers HTTP/1.1

{
    "call": "get",
    "data": {
        "id": 123
    }

}
```

## RPC Style - XML

### Criar um customer
```http
POST /customers HTTP/1.1

<methodCall>
    <methodName>create</methodName>
    <params>
        <param>
            <value>
                <struct>
                    <member>
                        <name>name</name>
                        <value>John Doe</value>
                    </member>
                    <member>
                        <name>email</name>
                        <value>user@user.com</value>
                    </member>
                    <member>
                        <name>phone</name>
                        <value>1234567890</value>
                    </member>
                    <member>
                        <name>address</name>
                        <value>
                            <struct>
                                <member>
                                    <name>street</name>
                                    <value>1234 Main St</value>
                                </member>
                                <member>
                                    <name>city</name>
                                    <value>Springfield</value>
                                </member>
                                <member>
                                    <name>state</name>
                                    <value>IL</value>
                                </member>
                                <member>
                                    <name>zip</name>
                                    <value>62701</value>
                                </member>
                            </struct>
                        </value>
                    </member>
                </struct>
            </value>
        </param>
    </params>
</methodCall>
```

### Pegar um customer
```http
POST /customers HTTP/1.1

<methodCall>
    <methodName>get</methodName>
    <params>
        <param>
            <value>
                <struct>
                    <member>
                        <name>id</name>
                        <value>123</value>
                    </member>
                </struct>
            </value>
        </param>
    </params>
</methodCall>
```

# Exemplo do level 1 - resources

## Exemplo REST meia boca para E-commerce

| Operação                                      | Método HTTP | Path                                           |
|-----------------------------------------------|-------------|------------------------------------------------|
| JWT login                                     | POST        | /jwt/login                                     |
| Session login                                 | POST        | /session/login                                 |
| Session logout                                | POST        | /session/logout                                |
| Create a customer                             | POST        | /customers                                     |
| Get a customer by ID                          | GET         | /admin/customers/:customer_id                  |
| List customers with pagination                | GET         | /admin/customers                               |
| Update a customer                             | PATCH       | /admin/customers/:customer_id                  |
| Delete a customer                             | DELETE      | /admin/customers/:customer_id                  |
| Create a category                             | POST        | /admin/categories                              |
| Get a category by slug                        | GET         | /categories/:category_slug                     |
| List categories with pagination               | GET         | /categories                                    |
| List categories in admin with pagination      | GET         | /admin/categories                              |
| Update a category                             | PATCH       | /admin/categories/:category_id                 |
| Delete a category                             | DELETE      | /admin/categories/:category_id                 |
| Create a product                              | POST        | /admin/products                                |
| Get a product by ID                           | GET         | /admin/products/:product_id                    |
| Get a product by slug                         | GET         | /products/:product_slug                        |
| Update a product                              | PATCH       | /admin/products/:product_id                    |
| Delete a product                              | DELETE      | /admin/products/:product_id/delete             |
| List products with pagination                 | GET         | /products                                      |
| List products in admin with pagination        | GET         | /admin/products                                |
| Get CSV of products                           | GET         | /admin/products.csv                            |
| Create a cart                                 | POST        | /carts                                         | 
| Add an item to the cart                       | POST        | /carts/:cart_uuid/items                        | 
| Get a cart by ID                              | GET         | /carts/:cart_uuid                              |
| Remove an item from the cart                  | DELETE      | /carts/:cart_uuid/items/:cart_item_id          |
| Clear the cart                                | POST        | /carts/:cart_uuid/clear                        |
| Create an order                               | POST        | /orders                                        |
| List orders with pagination                   | GET         | /orders                                        |

## Lista de verbos

| **Verbo**   | **Objetivo**                        | **Idempotente** | **Safe** |
|-------------|-------------------------------------|----------------|---------|
| `GET`       | Recuperar recursos                  | Sim            | Sim     |
| `POST`      | Criar um recurso                    | Não            | Não     |
| `PUT`       | Substituir recurso completamente    | Sim            | Não     |
| `PATCH`     | Atualizar parcialmente um recurso   | Sim            | Não     |
| `DELETE`    | Remover um recurso                  | Sim            | Não     |
| `HEAD`      | Obter cabeçalhos                    | Sim            | Sim     |
| `OPTIONS`   | Verificar métodos permitidos        | Sim            | Sim     |
| `TRACE`     | Depurar requisição                  | Sim            | Não     |
| `CONNECT`   | Estabelecer túnel                   | Não            | Não     |

# Lista dos status codes

https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status

```http
POST /products

{
    "name": "Product 1",
    "price": 100
}
```

```json
{
    "id": 1,
    "name": "Product 1",
    "price": 100,
    "_links": {
        "self": {
            "href": "/products/1"
        },
        "update": {
            "href": "/products/1",
            "method": "PUT",
            "type": "application/json"
        },
        "delete": {
            "href": "/products/1",
            "method": "DELETE",
        }
    }
}
```

https://datatracker.ietf.org/doc/html/rfc5988

- URI: O endereço do recurso alvo
- Rel: O tipo de relação entre o recurso atual e o recurso alvo
- Type: O tipo de conteúdo que será obtido ou o verbo HTTP que será usado

<link href="theme.css" rel="stylesheet" type="text/css" />

```json
{
  "name": "createUser",
  "title": "Create User",
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "title": "Username",
      "description": "Enter your desired username."
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "Email Address"
    },
    "password": {
      "type": "string",
      "format": "password",
      "title": "Password"
    }
  },
  "required": ["username", "email", "password"],
  "links": [
    {
      "rel": "create",
      "href": "/users",
      "method": "POST"
    }
  ]
}
```