import * as Joi from 'joi';

export default () => {
  return {
    port: process.env.API_PORT,
    database: {
      uri: process.env.DB_URI,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES,
    },
    admin: {
      name: process.env.ADMIN_NAME,
      lastname: process.env.ADMIN_LASTNAME,
      dni: process.env.ADMIN_DNI,
      password: process.env.ADMIN_PASSWORD,
    },
  };
};

export const limits = {
  age: {
    min: 14,
    max: 99,
  },
  dni: {
    min: 100000,
    max: 40000000,
  },
  password: {
    min: 10,
  },
};

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  API_PORT: Joi.number().default(3000).min(1000).max(65535),

  DB_URI: Joi.string().required(),
  DB_USER: Joi.optional().default(''),
  DB_PASSWORD: Joi.optional().default(''),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().default('300s'),

  ADMIN_NAME: Joi.string().required(),
  ADMIN_LASTNAME: Joi.string().required(),
  ADMIN_DNI: Joi.number().min(limits.dni.min).max(limits.dni.max).required(),
  ADMIN_PASSWORD: Joi.string().min(10).required(),
});
