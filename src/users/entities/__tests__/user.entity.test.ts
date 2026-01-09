import { validate } from 'class-validator';

import { User } from '../user.entity';

describe('User', () => {
  it('validate success', async () => {
    const user = new User();

    user.name = 'Ivan Ivanov';
    user.about = 'hello! this is me';

    const errors = await validate(user);

    expect(errors).toEqual([]);
  });

  it('validate fail', async () => {
    const user = new User();

    user.name = 'Ivan Ivanov';
    user.about = 'this is me';

    const errors = await validate(user);

    expect(errors).toEqual([
      {
        children: [],
        constraints: { contains: 'about must contain a hello string' },
        property: 'about',
        target: { about: 'this is me', id: undefined, name: 'Ivan Ivanov' },
        value: 'this is me',
      },
    ]);
  });
});
