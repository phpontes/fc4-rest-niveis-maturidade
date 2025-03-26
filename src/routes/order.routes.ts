import { Router } from 'express';
import { createOrderService } from '../services/order.service';

const router = Router();

router.post('/', async (req, res) => {
    const orderService = await createOrderService();
    const { payment_method, card_token } = req.body;
    // @ts-expect-error
    const { cart_id } = req.session;
    // @ts-expect-error
    const customerId = req.userId;
    const { order, payment } = await orderService.createOrder({customerId, payment_method, card_token, cart_id});
    res.json({ order, payment });
});

router.get('/', async (req, res) => {
    const orderService = await createOrderService();
    const { page = 1, limit = 10 } = req.query;
    // @ts-expect-error
    const customerId = req.userId;
    const { orders, total } = await orderService.listOrders({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        customerId
    });
    res.json({ orders, total });
});


export default router;