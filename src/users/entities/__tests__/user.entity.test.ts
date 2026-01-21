import { validate } from 'class-validator';

import { User } from '../user.entity';

describe('User', () => {
  it('validate success', async () => {
    const user = new User();

    user.username = 'Ivan Ivanov';
    user.password = 'password123';
    user.about = 'hello! this is me';
    user.balance = 100;

    const errors = await validate(user);

    expect(errors).toEqual([]);
  });

  it('validate fail - balance is not integer', async () => {
    const user = new User();

    user.username = 'Ivan Ivanov';
    user.password = 'password123';
    user.about = 'this is me';
    user.balance = 10.5;

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('balance');
    expect(errors[0].constraints).toEqual({
      isInt: 'balance must be an integer number',
    });
  });

  it('validate fail - balance is negative', async () => {
    const user = new User();

    user.username = 'Ivan Ivanov';
    user.password = 'password123';
    user.about = 'this is me';
    user.balance = -10;

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('balance');
    expect(errors[0].constraints).toEqual({
      min: 'balance must not be less than 0',
    });
  });

  it('validate fail - username is empty', async () => {
    const user = new User();

    user.username = '';
    user.password = 'password123';
    user.about = 'this is me';
    user.balance = 100;

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('username');
    expect(errors[0].constraints).toEqual({
      isNotEmpty: 'username should not be empty',
    });
  });

  it('validate fail - password is empty', async () => {
    const user = new User();

    user.username = 'Ivan Ivanov';
    user.password = '';
    user.about = 'this is me';
    user.balance = 100;

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('validate fail - password is too short', async () => {
    const user = new User();

    user.username = 'Ivan Ivanov';
    user.password = '12345';
    user.about = 'this is me';
    user.balance = 100;

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('password');
    expect(errors[0].constraints).toEqual({
      minLength: 'password must be longer than or equal to 6 characters',
    });
  });
});
