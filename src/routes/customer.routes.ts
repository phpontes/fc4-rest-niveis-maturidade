import { Router } from "express";
import { createCustomerService } from "../services/customer.service";
import { CreateCustomerDto } from "../validations/customer.validations";
import { validateSync } from "class-validator";
import { ValidationError } from "../errors";

const router = Router();

router.post("/", async (req, res, next) => {
  const customerService = await createCustomerService();
  const validator = new CreateCustomerDto(req.body);
  const errors = validateSync(validator);

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  const { name, email, password, phone, address } = req.body;
  try {
    const customer = await customerService.registerCustomer({
      name,
      email,
      password,
      phone,
      address,
    });
    res.json(customer);
  } catch (e) {
    next(e);
  }
});

export default router;