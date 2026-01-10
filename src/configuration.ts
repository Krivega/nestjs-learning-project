import * as Joi from 'joi';

export const schema = Joi.object({
  // port должен быть целым числом со значением по умолчанию 3000
  port: Joi.number().integer().default(3000),
  // databse это объект с полями url и port
  database: Joi.object({
    // url должно быть строкой и соответствовать регулярному выражению
    url: Joi.string().pattern(/postgres:\/\/[A-Za-z]/),
    // port должен быть целым числом
    port: Joi.number().integer(),
  }),
});

export default function configuration() {
  return {
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    database: {
      url: process.env.DATABASE_URL,
      port: Number.parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    },
  };
}
