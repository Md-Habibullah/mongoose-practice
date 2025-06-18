import express, { Request, Response } from 'express';
import { User } from '../models/user.model';
import { z } from 'zod';
import bcrypt from "bcryptjs";

export const userRoutes = express.Router();

const createUserZodSchema = z.object(
    {
        firstName: z.string(),
        lastName: z.string(),
        age: z.number(),
        email: z.string(),
        password: z.string(),
        role: z.string().optional()
    }
)

userRoutes.post('/create-user', async (req: Request, res: Response) => {

    try {
        const zodBody = await createUserZodSchema.parseAsync(req.body)
        const body = req.body
        // console.log('zod body', body)

        // const password = await bcrypt.hash(body.password, 10)
        // console.log(password)
        // body.password = password;

        // ! built-in and custom instance methods
        // const user = new User(body)

        // const encryptedPassword = await user.hashPassword(body.password)
        // user.password = encryptedPassword

        // await user.save();

        // ! built-in and custom static methods

        const encryptedPassword = await User.hashPassword(body.password);
        body.password = encryptedPassword;
        const user = await User.create(body);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            User: user
        })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
    }
})

userRoutes.get('/', async (req: Request, res: Response) => {

    const users = await User.find()

    res.status(201).json({
        success: true,
        message: 'User get successfully',
        User: users
    })
})

userRoutes.get('/:userId', async (req: Request, res: Response) => {

    const userId = req.params.UserId;

    const user = await User.findById(userId)

    res.status(201).json({
        success: true,
        message: 'single user created successfully',
        User
    })
})

userRoutes.patch('/:userId', async (req: Request, res: Response) => {

    const userId = req.params.UserId;
    const updatedBody = req.body;
    // const User = await User.findById(UserId)
    const user = await User.findByIdAndUpdate(userId, updatedBody, { new: true })

    res.status(201).json({
        success: true,
        message: 'User updated successfully',
        User
    })
})

userRoutes.delete('/:userId', async (req: Request, res: Response) => {

    const userId = req.params.UserId;

    const user = await User.findByIdAndDelete(userId)

    res.status(201).json({
        success: true,
        message: 'User deleted successfully',
        User
    })
})
