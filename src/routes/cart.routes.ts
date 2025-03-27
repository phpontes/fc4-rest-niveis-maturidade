import { Router } from "express";
import { createCartService } from "../services/cart.service";

const router = Router();

router.post("/", async (req, res) => {
  const cartService = await createCartService();
  //@ts-expect-error
  const customerId = req.userId;
  const cart = await cartService.createCart(customerId);
  req.json(cart);
});

router.post("/:cartUuid/items", async (req, res) => {
  const cartService = await createCartService();
  // @ts-expect-error
  const customerId = req.userId;
  const { productId, quantity } = req.body;
  const cart = await cartService.addItemToCart({
    uuid: req.params.cartUuid,
    customerId: customerId,
    productId: parseInt(productId),
    quantity: parseInt(quantity),
  });
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

router.get("/:cartUuid", async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.getCart(req.params.cartUuid);
  res.json(cart);
});

router.delete("/:cartUuid/items/:cartItemId", async (req, res) => {
  const cartService = await createCartService();
  const { cartItemId } = req.params;
  await cartService.removeItemFromCart({
    cartUuid: req.params.cartUuid,
    cartItemId: parseInt(cartItemId),
  });
  res.send({ message: "Item removed from cart" });
});

router.post("/:cartUuid/clear", async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.clearCart(req.params.cartUuid);
  res.json(cart);
});

export default router;