import { Model, model, Schema } from "mongoose";
import { IAddress, IUser, UserInstanceMethods, UserStaticMethods } from "../interfaces/user.interface";
import validator from 'validator'
import bcrypt from "bcryptjs";

const addressSchema = new Schema<IAddress>({
    city: { type: String },
    street: { type: String },
    zip: { type: Number }
}, { _id: false })

const userSchema = new Schema<IUser, UserStaticMethods, UserInstanceMethods>({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 10
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 10
    },
    age: {
        type: Number,
        required: true,
        min: [18, 'age might be at least 18, got {VALUE}'],
        max: 60
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: [true, 'email is common'],
        lowercase: true,
        // validate: {
        //     validator: value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        //     message: prop => `${prop.value} mamma mal ta to valid na`
        // },
        validate: [validator.isEmail, 'mamma mal ee to jhamela ache! {VALUE}']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        uppercase: true,
        enum: {
            values: ['USER', 'ADMIN', 'SUPERADMIN'],
            message: 'role is not valid, got {VALUE}'
        },
        default: 'USER'
    },
    address: { type: addressSchema }
}, {
    versionKey: false,
    timestamps: true
})

userSchema.method('hashPassword', async function hashPassword(plainPassword: string) {
    const password = await bcrypt.hash(plainPassword, 10)
    return password
});

userSchema.static('hashPassword', async function hashPassword(plainPassword: string) {
    const password = await bcrypt.hash(plainPassword, 10)
    return password
});

export const User = model<UserStaticMethods>('User', userSchema);