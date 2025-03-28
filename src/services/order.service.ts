import { Repository } from "typeorm";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { Payment, PaymentMethod, PaymentStatus } from "../entities/Payment";
import { createDatabaseConnection } from "../database";
import { Customer } from "../entities/Customer";

export class OrderService {
  constructor(
    private cartRepository: Repository<Cart>,
    private customerRepository: Repository<Customer>,
    private orderRepository: Repository<Order>,
    private orderItemRepository: Repository<OrderItem>,
    private paymentRepository: Repository<Payment>
  ) {}

  async createOrder(data: {
    customerId: number;
    payment_method: PaymentMethod;
    cart_uuid: string;
    card_token?: string
  }): Promise<{ order: Order; payment: Payment }> {
    const { customerId, payment_method, card_token } = data;
    const cart = await this.cartRepository.findOne({
      where: {uuid: data.cart_uuid },
      relations: ["items", "items.product", "customer"],
    });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    if(!cart.customer){
      cart.customer = customer;
      await this.cartRepository.save(cart);
    }

    const order = new Order();
    order.customer = customer;
    order.createdAt = new Date();
    order.orderItems = [];

    for (const cartItem of cart.items) {
      const orderItem = new OrderItem();
      orderItem.product = cartItem.product;
      orderItem.price = cartItem.product.price;
      orderItem.quantity = cartItem.quantity;
      order.orderItems.push(orderItem);
      await this.orderItemRepository.save(orderItem);
    }

    await this.orderRepository.save(order);

    // Clear the cart after creating the order
    cart.items = [];
    await this.cartRepository.save(cart);

    // Attempt to pay for the order
    const payment = new Payment();
    payment.order = order;
    payment.method = payment_method;
    payment.amount = order.orderItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    payment.status = PaymentStatus.PAID;

    await this.paymentRepository.save(payment);

    return { order, payment };
  }

  async listOrders(data: {
    page: number,
    limit: number,
    customerId?: number
  }): Promise<{ orders: Order[]; total: number }> {
    const { page, limit, customerId } = data;
    const where: any = {};
    if (customerId) {
      where.customer = { id: customerId };
    }

    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      relations: ["orderItems", "orderItems.product"],
      take: limit,
      skip: (page - 1) * limit,
    });

    return { orders, total };
  }
}

export async function createOrderService(): Promise<OrderService> {
  const {
    cartRepository,
    customerRepository,
    orderRepository,
    orderItemRepository,
    paymentRepository,
  } = await createDatabaseConnection();

  return new OrderService(
    cartRepository,
    customerRepository,
    orderRepository,
    orderItemRepository,
    paymentRepository
  );
}
