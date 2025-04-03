import { Router } from "express";
import { createOrderService } from "../services/order.service";
import { Resource } from "../http/resource";

const router = Router();

router.post("/", async (req, res, next) => {
  const orderService = await createOrderService();
  const { payment_method, card_token, cart_uuid } = req.body;
  // @ts-expect-error
  const customerId = req.userId;
  const { order, payment } = await orderService.createOrder({
    customerId,
    payment_method,
    card_token,
    cart_uuid,
  });
  const resource = new Resource(
    {
      order,
      payment,
    },
    {
      _links: {
        self: {
          href: `/orders/${order.id}`,
          method: "GET",
        },
        cancel: {
          href: `/orders/${order.id}`,
          method: "DELETE",
        },
        payment: {
          href: `/orders/${order.id}/payments`,
          method: "POST",
        },
      },
    }
  );
  next(resource);
});

//localhost:3000 / orders / 1

http: router.get("/", async (req, res) => {
  const orderService = await createOrderService();
  const { page = 1, limit = 10 } = req.query;
  // @ts-expect-error
  const customerId = req.userId;
  const { orders, total } = await orderService.listOrders({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    customerId,
  });
  res.json({ orders, total });
});

export default router;