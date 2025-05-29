import { StatusCodes } from "http-status-codes";
//import { bitnobCustomer } from "../../services/bitnob/BitnobCustomer.js";
import { BadRequestError } from "../../errors/errors.js";
import { customerCreateMock, customerGetMock, getCustomersMock } from "./customers.mocks.js";

export const createCustomer = async (req, res) => {
  // Validate request body
  // save customerId to users table
  try {
    //const result = await bitnobCustomer.create(req.body);
    const result = customerCreateMock(req.body);
    // res.status(StatusCodes.CREATED).json(result.data);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    throw new BadRequestError(error.response.data.message, "Customer.create() controller");
  }
}

export const getCustomer = async (req, res) => {
  // Validate request body
  // save customerId to users table
  try {
    //const result = await bitnobCustomer.create(req.body);
    const result = customerGetMock(req.params.customerId);
    // res.status(StatusCodes.CREATED).json(result.data);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    throw new BadRequestError(error.response.data.message, "Customer.get() controller");
  }
}

export const getCustomers = async (req, res) => {
  // Validate request body
  // save customerId to users table
  try {
    //const result = await bitnobCustomer.create(req.body);
    const result = getCustomersMock();
    // res.status(StatusCodes.CREATED).json(result.data);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    throw new BadRequestError(error.response.data.message, "Customers.get() controller");
  }
}