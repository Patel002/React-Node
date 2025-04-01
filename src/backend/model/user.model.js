import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize.js";
import bcrypt from 'bcrypt';

const User = sequelize.define('user', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+]).{6,}$/,
                msg: 'Password must be atleast 6 characters long'
            }
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
                is: {
                    args:/^\+?\d{1,4}?[ -]?\d{10,15}$/,
                    msg: 'Phone number must be valid upto 10 digits (optional country code allowed)'
                }
            }
        },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }    
},{
    timestamps: true
})

User.beforeSave(async (user) => {
    if(user.changed('password')) {
        console.log("Original Password:", user.password);
        user.password = await bcrypt.hash(user.password, 8);
        console.log("Hashed Password Before Saving:", user.password);

    }
})

User.prototype.validatePassword = async function(password) {
    console.log("Input Password:", password);
    console.log("Stored Hashed Password:", this.password);
    return await bcrypt.compare(password, this.password);
}

// User.sync({alter: true});

export { User };