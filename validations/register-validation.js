import { body, check } from "express-validator"
import User from "../models/users.js"



export const isCheckRegister = () => [
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be at least 3 characters and a maximum of 20 characters")
        .isAlphanumeric()
        .custom(value => {
            return User.findByUsername(value).then(user => {
                if (user) {
                    return Promise.reject('Username is used.')
                }
            })
        }),

    body('email')
        .isEmail()
        .withMessage('Write valid e-mail')
        .custom(value => {
            return User.findByEmail(value).then(user => {
                if (user) {
                    return Promise.reject('Email already in use.')
                }
            })
        }),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Your password must be at least 6 characters'),

    body('passwordConfirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    }),
    check('avatar')
        .custom((value, { req }) => {
            if (!req.files || Object.keys(req.files).length == 0 || !req?.files?.avatar) {
                throw new Error('Profile picture must be uploaded.!')
            }
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
            const avatarImage = req.files.avatar
            if (!allowedMimeTypes.includes(avatarImage.mimetype)) {
                throw new Error('Only files in .jpeg, .png, .gif formats should be uploaded.')

            }
            if (avatarImage.size > 5 * 1024 * 1024) {
                throw new Error('File size should be max 5mb')
            }
            return true;
        })

        
]