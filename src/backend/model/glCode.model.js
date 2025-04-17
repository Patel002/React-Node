import { sequelize } from "../sequelize.js";
import { DataTypes } from "sequelize";

const Account = sequelize.define('account',{
   code: {
    type: DataTypes.STRING,
    allowNull: false
   }
})

Account.sync(() => {
    console.log("Account table created");
});

export { Account };