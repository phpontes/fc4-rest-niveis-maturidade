import { Repository } from "typeorm";
import { Customer } from "../entities/Customer";
import { User } from "../entities/User";
import { createDatabaseConnection } from "../database";

export class CustomerService {
  constructor(
    private customerRepository: Repository<Customer>,
    private userRepository: Repository<User>
  ) {}

  async registerCustomer(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }): Promise<Customer> {
    const { name, email, password, phone, address } = data;

    //check if the user already exists
    const userExists = await this.userRepository.findOne({ where: { email } });

    if (userExists) {
      throw new Error("User already exists");
    }

    // Create a new user
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;

    // Save the user
    const savedUser = await this.userRepository.save(user);

    const customer = new Customer();
    customer.id = savedUser.id;
    customer.phone = phone;
    customer.address = address;
    customer.user = savedUser;

    return await this.customerRepository.save(customer);
  }

  async updateCustomer(data: {
    customerId: number;
    phone?: string;
    address?: string;
    password?: string;
  }): Promise<Customer | null> {
    const { customerId, phone, address, password } = data;
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ["user"],
    });
    if (!customer) {
      return null;
    }

    if (phone) customer.phone = phone;
    if (address) customer.address = address;

    if (password) {
      const user = customer.user;
      if (password) user.password = password;
      await this.userRepository.save(user);
    }

    return await this.customerRepository.save(customer);
  }

  async getCustomer(customerId: number): Promise<Customer | null> {
    return await this.customerRepository.findOneBy({ id: customerId });
  }

  async deleteCustomer(customerId: number): Promise<void> {
    await this.customerRepository.delete({ id: customerId });
  }

  async listCustomers(data: {
    page: number;
    limit: number;
  }): Promise<{ customers: Customer[]; total: number }> {
    const { page, limit } = data;
    const [customers, total] = await this.customerRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { customers, total };
  }
}

export async function createCustomerService(): Promise<CustomerService> {
  const { customerRepository, userRepository } =
    await createDatabaseConnection();
  return new CustomerService(customerRepository, userRepository);
}