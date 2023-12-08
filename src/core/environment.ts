type Environment = {
    PORT?: number;
    STAGE?: string;
    FORWARD_URL: string;
    SWAGGER_HOST?: string;
    MONGO_URL: string;
    JWT_SECRET: string;
    MONGO_DB: string;
    BCRYPT_SALT: number;
    SECRET_KEY: string;
};

const environment = {
    PORT: Number(process.env.PORT),
    STAGE: process.env.STAGE,
    FORWARD_URL: process.env.FORWARD_URL,
    SWAGGER_HOST: process.env.SWAGGER_HOST,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_DB: process.env.MONGO_DB,
    BCRYPT_SALT: Number(process.env.BCRYPT_SALT),
    SECRET_KEY: process.env.SECRET_KEY,
} as Environment;

export default environment;
