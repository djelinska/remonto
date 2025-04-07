import AppError from '../utils/AppError'; // adjust path if needed

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const error = new AppError('Something went wrong', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it('should default to statusCode 400 if not provided', () => {
    // @ts-expect-error - intentionally omitting statusCode
    const error = new AppError('Missing status');

    expect(error.statusCode).toBe(400);
  });

  it('should capture the correct stack trace', () => {
    const error = new AppError('Trace check', 500);

    expect(error.stack).toContain('AppError'); // stack trace should include constructor name
  });
});

