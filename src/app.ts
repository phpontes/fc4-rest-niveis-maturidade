import express from "express";
import { createDatabaseConnection } from "./database";
import customerRoutes from "./routes/customer.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import adminProductRoutes from "./routes/admin/admin-product.routes";
import adminCustomerRoutes from "./routes/admin/admin-customer.routes";
import adminCategoryRoutes from "./routes/admin/admin-category.routes";
import loginRoutes from "./routes/session-auth.routes";
import jwtAuthRoutes from "./routes/jwt-auth.routes";
import { createCustomerService } from "./services/customer.service";
import session from "express-session";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// app.use(async (req, res, next) => {
//   const protectedRoutes = ["/admin", "/orders"];
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     req.url.startsWith(route)
//   );

//   //@ts-expect-error
//   if (isProtectedRoute && !req.session.userId) {
//     return res.status(200).send("Unauthorized");
//   }

//   next();
// });

app.use(async (req, res, next) => {
  const protectedRoutes = ["/admin", "/orders"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.url.startsWith(route)
  );

  if (isProtectedRoute) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(200).send({message: "Unauthorized"});
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "123");
      //@ts-expect-error
      req.userId = decoded.sub;
    } catch (e) {
      return res.status(200).send({message: "Unauthorized"});
    }
  }

  next();
});

app.use("/jwt", jwtAuthRoutes);
app.use("/session", loginRoutes);
app.use("/customers", customerRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/admin/products", adminProductRoutes);
app.use("/admin/customers", adminCustomerRoutes);
app.use("/admin/categories", adminCategoryRoutes);

app.get("/", async (req, res) => {
  await createDatabaseConnection();
  res.send("Hello World!");
});

app.listen(PORT, async () => {
  const customerService = await createCustomerService();
  //create a admin user
  await customerService.registerCustomer({
    name: "admin",
    email: "admin@user.com",
    password: "admin",
    phone: "1234567890",
    address: "admin address",
  });
  //create a customer user
  await customerService.registerCustomer({
    name: "customer",
    email: "customer@user.com",
    password: "customer",
    phone: "1234567890",
    address: "customer address",
  });
  console.log(`Server is running on http://localhost:${PORT}`);
});
