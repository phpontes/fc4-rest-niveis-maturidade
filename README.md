
# Full Cycle 4 - REST e Níveis de Maturidade na prática

## Descrição

Este repositório contém o código fonte do projeto desenvolvido durante o curso Full Cycle 4.0 - REST e Níveis de Maturidade na prática.

## Professor

<a href="https://github.com/argentinaluiz">
    <img src="https://avatars.githubusercontent.com/u/4926329?v=4?s=100" width="100px;" alt=""/>
    <br />
    <sub>
        <b>Luiz Carlos</b>
    </sub>
</a>

---

## Sumário

1. [Introdução](#introdução)  
2. [Slides](#slides)
3. [Exemplo REST meia boca para E-commerce](#exemplo-rest-meia-boca-para-e-commerce)  
4. [Documentação do HTTP](#documentação-do-http)  
   - [Especificação do verbo HTTP PATCH](#especificação-do-verbo-http-patch)  
5. [Níveis de Maturidade REST](#níveis-de-maturidade-rest)  
   - [Exemplo de Level 0](#exemplo-de-level-0)  
   - [Exemplo de Level 1](#exemplo-de-level-1---resources)  
   - [Exemplo de Level 3 - Hypermedia Controls](#exemplo-do-level-3---hypermedia-controls)
6. [Outro exemplo que uma API Restful com Laminas API Tools](#laminas-api-tools)
7. [Lista de Verbos HTTP](#lista-de-verbos-http)  
8. [Lista de Status Codes](#lista-de-status-codes)  
9. [Referências](#referências)  

## Introdução

Neste curso, exploramos os conceitos de REST e seus níveis de maturidade na prática, usando como exemplo um sistema de E-commerce que não implementa REST corretamente.

## Slides

- [Slides do curso](./Curso%20de%20REST.pdf)

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

---

## Documentação do HTTP

### [HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc2616)

### [Especificação do verbo HTTP PATCH](https://datatracker.ietf.org/doc/html/rfc5789)

---

## Níveis de Maturidade REST

### Exemplo de Level 0

#### RPC Style - JSON

Criar um customer:

```http
POST /customers HTTP/1.1

{
    "call": "create",
    "data": {
        "name": "John Doe",
        "email": "user@customer.com",
        "phone": "1234567890",
        "address": {
            "street": "1234 Main St",
            "city": "Springfield",
            "state": "IL",
            "zip": "62701"
        }
    }
}
```

Pegar um customer:

```http
POST /customers HTTP/1.1

{
    "call": "get",
    "data": {
        "id": 123
    }
}
```

---

### Exemplo de Level 1 - Resources

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

### Exemplo do Level 3 - Hypermedia Controls

#### Request:

```http
POST /products

{
    "name": "Product 1",
    "price": 100
}
```

#### Response:

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
            "method": "DELETE"
        }
    }
}
```

## Laminas API Tools

Aqui está um exemplo de uma API Restful com Laminas API Tools.

- [Laminas API Tools](https://github.com/devfullcycle/api-tools-skeleton)

## Lista de Verbos HTTP

| **Verbo**   | **Objetivo**                        | **Idempotente** | **Safe** |
|-------------|-------------------------------------|----------------|---------|
| `GET`       | Recuperar recursos                  | Sim            | Sim     |
| `POST`      | Criar um recurso                    | Não            | Não     |
| `PUT`       | Substituir recurso completamente    | Sim            | Não     |
| `PATCH`     | Atualizar parcialmente um recurso   | Sim            | Não     |
| `DELETE`    | Remover um recurso                  | Sim            | Não     |
| `HEAD`      | Obter cabeçalhos                    | Sim            | Sim     |
| `OPTIONS`   | Verificar métodos permitidos        | Sim            | Sim     |
---

## Lista de Status Codes

Confira a lista completa de status codes no [MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status).

---

## Referências

- [Disseratação do REST](https://ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)
- [Roy Fielding Frustado com REST](https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)
- [Richardson Maturity Model](https://www.crummy.com/writing/speaking/2008-QCon/act3.html)
- [Livro REST in Practice](https://www.amazon.com/REST-Practice-Hypermedia-Systems-Architecture/dp/0596805829)
- [HTTP 1.1 - RFC 2616](https://datatracker.ietf.org/doc/html/rfc2616)
- [HTTP PATCH - RFC 5789](https://datatracker.ietf.org/doc/html/rfc5789)
- [Hypermedia Controls - RFC 5988](https://datatracker.ietf.org/doc/html/rfc5988)
- [Json+Hal](https://stateless.group/hal_specification.html)
- [Cache Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)