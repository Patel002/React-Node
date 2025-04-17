import { sequelize } from "../sequelize.js";
import { DataTypes } from "sequelize";

const Terms = sequelize.define('terms',{
   fullTerm: {
       type: DataTypes.TEXT,
       allowNull: false
   },
    type: {
        type: DataTypes.ENUM(
            "purchase", "sales-tax", "sales-quotation"
        ),
        allowNull: false
    }
})

// Terms.sync({force: true});

export { Terms };