import { Router } from 'express';
import { createCustomerService } from '../../services/customer.service';

const router = Router();

router.post('/', async (req, res) => {
    const customerService = await createCustomerService();
    const { name, email, password, phone, address } = req.body;
    const customer = await customerService.registerCustomer({name, email, password, phone, address});
    res.json(customer);
});

router.get('/:customerId', async (req, res) => {
    const customerService = await createCustomerService();
    const customer = await customerService.getCustomer(+req.params.customerId);
    res.send(customer ? customer : {message: 'Customer not found'});
    //res.json(customer);
});

router.post('/:customerId', async (req, res) => {
    const customerService = await createCustomerService();
    const { customerId } = req.params;
    const { phone, address, password } = req.body;
    const customer = await customerService.updateCustomer({phone, address, customerId +customerId, password});
    res.json(customer);
});

router.post('/:customerId/delete', async (req, res) => {
    const customerService = await createCustomerService();
    const { customerId } = req.params;
    await customerService.deleteCustomer(+customerId);
    res.send({message: 'Customer deleted successfully'});
});

router.get('/', async (req, res) => {
    const customerService = await createCustomerService();
    const { page = 1, limit = 10 } = req.query;
    const { customers, total } = await customerService.listCustomers({
        page: parseInt(page as string),
        limit: parseInt(limit as string)
    });
    res.json({ customers, total });
});

export default router;