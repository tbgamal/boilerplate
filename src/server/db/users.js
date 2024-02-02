const db = require('./client')
const bcrypt = require ('bcrypt')
const SALT_COUNT = 10;

const createUser = async({ name= 'first last', email, password, isAdmin }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try{
    console.log ('creating new user...')
    const {rows : [ user ]} = await db.query(`
    INSERT INTO users (name, email, password, "isAdmin")
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
    RETURNING *`, [name, email, hashedPassword, isAdmin]);

    return user
  }
  catch (err) {
    throw err
  }
}

const getUser = async({email,password}) => {
  if (!email || !password) {
    return;
  }
  try {
    console.log (`getting user with this email ${email}....`)
    const user = await getUserByEmail(email);
    if(!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword)
    if (!passwordsMatch) return;
    delete user.password;
    return user;
  }
  catch (err){
    throw err
  }
}

const getUserByEmail = async(email) => {
  try {

    console.log (`this is the email you're looking for ${ email }...`)
      const { rows: [ user ] } = await db.query(`
      SELECT * 
      FROM users
      WHERE email=$1;`, [ email ]);

      if(!user) {
          return;
      }
      return user;
  } catch (err) {
      throw err;
  }
}

const getUserById = async(id) => {
  try {
    const { rows: [user]} = await db.query(`
    SELECT * FROM users
    WHERE id = $1
    `, [id]);

    if (!user) return null;
    delete user.password

    return user
  }
  catch (err){
    throw err;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserByEmail,
  getUserById
}