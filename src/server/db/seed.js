const db = require('./client');
const { createUser } = require ('./users')

const users = [
  {
    name: 'Admin1',
    email: 'admin@admin.com',
    password: 'admin',
    isAdmin: true,
  },
  {
    name: 'Emily Johnson',
    email: 'emily@example.com',
    password: 'securepass',
  },
  {
    name: 'Liu Wei',
    email: 'liu@example.com',
    password: 'strongpass',
  },
  {
    name: 'Mohammed Ahmed',
    email: 'mohammed@example.com',
    password: 'mysecretpassword',
  },
  {
    name: 'Isabella García',
    email: 'bella@example.com',
    password: 'pass1234',
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
  },
]

const dropTables = async () => {
  try{
    await db.query(`
    DROP TABLE IF EXISTS users;
    `);
  }
  catch(err){
    throw err
  }
}

const createTables = async () => {
  try{
    await db.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) DEFAULT 'name',
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "isAdmin" BOOL DEFAULT FALSE
    )
    `)
  }
  catch (err) {
    throw err
  }
}

const insertUsers = async () => {
  console.log ('creating initial users...')
  try {
    for (const user of users) {
      await createUser({name: user.name, email: user.email, password: user.password, isAdmin: user.isAdmin})
    }
    console.log ('Seed data inserted successfully!')
  }
  catch(err) {
    console.error ('Error inserting seed data:', err)
  }
}

const seedDatabase = async () => {
  try{
    db.connect();
    await dropTables();
    await createTables();
    await insertUsers();
  }
  catch (err) {
    throw err;
  }
  finally {
    db.end()
  }
}

seedDatabase()