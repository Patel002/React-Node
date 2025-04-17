import { sequelize } from "../sequelize.js";
import { DataTypes } from "sequelize";

const Info = sequelize.define('info',{

    companyFullName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "company name is compulsory"
            }
        }
    },

    companyShortName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "company short name is also compulsory"
            }
        }
    },

    proprietor:{
        type:DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "company short name is also compulsory"
            }
        }
    },

    phone:{
        type: DataTypes.STRING,
        allowNull: false,
         validate: {
            notEmpty: {
                msg: "phone number is required field"
            }
        }
    },

    phone2: {
        type: DataTypes.STRING,
        allowNull: true
    },

    emailId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },

    emailId2: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },

    country: {
        type: DataTypes.STRING,
        allowNull: false
    },

    state: {
        type: DataTypes.STRING,
        allowNull: false
    },

    pincode: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "postal code is required field"
            }
        }
    },
      
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },

    stateCode: {
        type: DataTypes.STRING,
        allowNull: false
    },

    addressLine1: {
        type: DataTypes.STRING,
        allowNull: false
    },

    addressLine2: {
        type: DataTypes.STRING,
        allowNull: true
    },

    gstApplicable: {
        type: DataTypes.ENUM('Yes', 'No'),
        defaultValue: 'Yes',
        allowNull: false
    },
    
    gstNo: {
        type: DataTypes.STRING,
        allowNull: false  
    },

    panNo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    cinNo: {
        type: DataTypes.STRING,
        allowNull: true
    },

    website: {
        type: DataTypes.STRING,
        allowNull: true
    },

    logo: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    timestamps:true
})

// Info.sync({alter: true});

export { Info };

