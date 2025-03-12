import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'dashboard',
    'root',
    'dhtsol',
    {
        host: 'localhost', dialect: 'mysql' ,logging: false,
        timezone: '+05:30'
    }
);

export {sequelize};