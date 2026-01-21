import { validate } from 'class-validator';

import { User } from '../user.entity';

describe('User', () => {
  it('validate success', async () => {
    const user = new User();

    user.name = 'Ivan Ivanov';
    user.about = 'hello! this is me';
    user.balance = 100;

    const errors = await validate(user);

    expect(errors).toEqual([]);
  });

  it('validate fail - balance is not integer', async () => {
    const user = new User();

    user.name = 'Ivan Ivanov';
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

    user.name = 'Ivan Ivanov';
    user.about = 'this is me';
    user.balance = -10;

    const errors = await validate(user);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toEqual('balance');
    expect(errors[0].constraints).toEqual({
      min: 'balance must not be less than 0',
    });
  });
});
