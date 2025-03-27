import { Router } from "express";
import { createCartService } from "../services/cart.service";

const router = Router();

router.post("/items", async (req, res) => {
  const cartService = await createCartService();
  //@ts-expect-error
  const cartId = req.session.cartId;
  // @ts-expect-error
  const customerId = req.userId;
  const { productId, quantity } = req.body;
  const cart = await cartService.addItemToCart({
    customerId: customerId,
    id: cartId,
    productId: parseInt(productId),
    quantity: parseInt(quantity),
  });
  //@ts-expect-error
  req.session.cartId = cart.id;
  req.session.save();
  res.json({
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
      },
    })),
    createdAt: cart.createdAt,
    customer: cart.customer
  });
});

router.get("/", async (req, res) => {
  const cartService = await createCartService();
  //@ts-expect-error
  const cartId = req.session.cartId;
  const cart = await cartService.getCart(parseInt(cartId as string));
  res.json(cart);
});

router.delete("/items/:cartItemId", async (req, res) => {
  const cartService = await createCartService();
  const { cartItemId } = req.params;
  //@ts-expect-error
  const cartId = req.session.cartId;
  await cartService.removeItemFromCart({
    cartId: parseInt(cartId),
    cartItemId: parseInt(cartItemId),
  });
  res.send({ message: "Item removed from cart" });
});

router.post("/clear", async (req, res) => {
  const cartService = await createCartService();
  //@ts-expect-error
  const cartId = req.session.cartId;
  const cart = await cartService.clearCart(cartId);
  res.json(cart);
});

export default router;