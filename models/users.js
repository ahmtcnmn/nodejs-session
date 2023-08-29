import pool from "../connect.js";
import {sqlLogger} from "../utils/logger.js";

class User {
    static async create(data) {
        const connection = await pool.getConnection()
        try {
            const [result] = await connection.execute('INSERT INTO kullanicilar SET email=:email,username=:username,password=:password,avatar=:avatar',data)
            return result
        } catch (e) {
            console.log('Hata', e)
            return
        } finally {
            connection.release()
        }
    }

    static async findById(id) {
        const connection = await pool.getConnection()
        try {
            sqlLogger.info({
				query: 'SELECT * FROM users WHERE id = :id',
				params: {id}
			})
            const [rows] = await connection.execute('SELECT * FROM kullanicilar WHERE id=:id', { id })
            return rows[0]
        } catch (e) {
            console.log('Hata', e)
            return
        } finally {
            connection.release()
        }
    }
    static async findByEmail(email) {
        const connection = await pool.getConnection()
        try {
            sqlLogger.info({
				query: 'SELECT * FROM users WHERE email = :email',
				params: {email}
			})
            const [rows] = await connection.execute('SELECT * FROM kullanicilar WHERE email=:email', { email })
            return rows[0]
        } catch (e) {
            console.log('Hata', e)
            return
        } finally {
            connection.release()
        }
    }
    static async findByUsername(username) {
        const connection = await pool.getConnection()
        try {
            sqlLogger.info({
				query: 'SELECT * FROM users WHERE username = :username',
				params: {username}
			})
            const [rows] = await connection.execute('SELECT * FROM kullanicilar WHERE username=:username', { username })
            return rows[0]
        } catch (e) {
            console.log('Hata', e)
            return
        } finally {
            connection.release()
        }
    }
    static async login(username,password){
        const connection = await pool.getConnection()
        try {
            sqlLogger.info({
				query: 'SELECT * FROM users WHERE username = :username && password = :password',
				params: {username, password}
			})
            const [rows] = await connection.execute('SELECT * FROM kullanicilar WHERE username=:username && password= :password', { username,password })
            return rows[0]
        } catch (e) {
            console.log('Hata', e)
            return
        } finally {
            connection.release()
        }
    }
}

export default User