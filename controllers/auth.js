import { validationResult } from "express-validator"
import slugify from "slugify"
import User from "../models/users.js"
import {encrypt} from "../utils/crypto.js"



export const getLoginController = (req, res) => {
    res.render('auth/auth')
}
export const postLoginController = async (req, res) => {
    const { username, password } = req.body;
    let error
    res.locals.formData = req.body
    if (!username) {
        error = 'Username cannot be found !'
    } else if (!password) {
        error = 'Password cannot be found'
    } else {

		try {
			const user = await User.login(username, password)
			if (user) {
				req.session.username = user.username
				req.session.user_id = encrypt(String(user.id))
                req.session.avatar=user.avatar;

				res.redirect('/')
			} else {
				error = 'Username cannot be found!'
			}
		} catch (err) {
			next(err)
		}

	}

	if (error) {
		res.render('auth/login', {
			error
		})
	}
}

export const logaout = (req, res) => {
    req.session.destroy()
    res.redirect("/")
}
export const getRegisterController = (req, res) => {
    res.render("auth/register")
}
export const postRegisterContoller = async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req)
    //Hata yoksa
    if (errors.isEmpty()) {
        let avatar = req.files.avatar
        //Fosya adını önce '.' larla ayırıyor sonra pop ile sonrdakini fileExtensiona alıyor. Sonrasında kalanları join ile birleştiriyor.
        //Let path yüklerken dosya konumu + tarihi + '-' + dosya adını + ayırdıgı uzantıyı ekleyerek kaydediyor
        let file = avatar.name.split('.')
        let fileExtension = file.pop()
        let fileName = file.join('')
        let path = 'upload/' + Date.now() + '-' + slugify(fileName, {
            lower: true,
            locale: 'tr',
            strict: true
        }) + '.' + fileExtension;//slugyify dosyadaki boslukları - ile çevirir yada bak kullanımlara baska da yapılır ve uzantıları korur

        avatar.mv(path, async err => {
            if (err) {
                return res.status(500).send(err)
            }
            //model yapısı
            const response = await  User.create({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                avatar: path
            })
            const user = await User.login(username, password)
            const userId = await User.findById(response.insertId)
            req.session.username = req.body.username;
            req.session.user_id = encrypt(String(user.id));
            req.session.avatar=path; 
            console.log(path)
            res.redirect('/login')

        })
    } else {
        res.render('auth/register', {
            errors: errors.array()
        })
    }
    

}
export const isCheckRegisterError = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
}

// const uploadIsempty= (req,res)=>{ Bu kendi denemem çalışıyor babba
//     const email=req.body.email;
//     const username= req.body.username;
//     const password= req.body.password;
//     let avatar = req.files.avatar
//     //Fosya adını önce '.' larla ayırıyor sonra pop ile sonrdakini fileExtensiona alıyor. Sonrasında kalanları join ile birleştiriyor.
//     //Let path yüklerken dosya konumu + tarihi + '-' + dosya adını + ayırdıgı uzantıyı ekleyerek kaydediyor
//     let file = avatar.name.split('.')
//     let fileExtension= file.pop()
//     let fileName= file.join('')
//     let path = 'upload/'+Date.now()+'-'+slugify(fileName,{
//         lower:true,
//     })+'.'+fileExtension;    
//     var sql = `INSERT INTO kullanicilar(id,email,username,password,avatar) VALUES (NULL,'${email}',' ${username}','${password}','${path}');`
//     con.query(sql, (err,result)=>{
//         if (err) {
//             console.error('Error updating data in the database: ' + err.stack);
//             return;
//         }
//     })
// }