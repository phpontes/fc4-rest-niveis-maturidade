import { ValidationError as ClassValidatorError } from "class-validator";

export class ValidationError extends Error {
  constructor(readonly error: ClassValidatorError[]) {
    super();
    this.name = "ValidationError";
  }
}