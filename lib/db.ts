import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import { hashSync, compareSync } from "bcryptjs"
import crypto from "crypto"
import type { User } from "./types"

// Define tipos para os resultados do SQLite
interface OrderRecord {
  id: number
  order_number: string
  status: string
  total: number
  created_at: string
}

interface OrderItemRecord {
  product_name: string
  quantity: number
  price: number
}

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, "qa-ecommerce.db")
const db = new Database(dbPath)

// Initialize database with tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    title TEXT,
    gender TEXT,
    country TEXT,
    age_group TEXT,
    marketing_emails BOOLEAN DEFAULT 0,
    product_updates BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    street TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_number TEXT NOT NULL,
    status TEXT NOT NULL,
    total REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`)

// Check if we need to seed the initial user
const seedUser = db.prepare("SELECT * FROM users WHERE email = ?").get("user@example.com")

if (!seedUser) {
  // Create initial test user - Use hashSync instead of hash to avoid Promise issues
  const hashedPassword = hashSync("password123", 10)
  const insertUser = db.prepare(`
    INSERT INTO users (
      name, 
      email, 
      password, 
      title, 
      gender, 
      country, 
      age_group, 
      marketing_emails, 
      product_updates
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const userId = insertUser.run(
    "Usuário Teste",
    "user@example.com",
    hashedPassword,
    "sr",
    "masculino",
    "brasil",
    "35-44",
    1,
    1,
  ).lastInsertRowid

  // Add address for test user
  const insertAddress = db.prepare(
    "INSERT INTO user_addresses (user_id, street, city, state, zip_code) VALUES (?, ?, ?, ?, ?)",
  )
  insertAddress.run(userId, "Rua Exemplo, 123", "São Paulo", "SP", "01234-567")

  // Add sample orders for test user
  const insertOrder = db.prepare("INSERT INTO orders (user_id, order_number, status, total) VALUES (?, ?, ?, ?)")
  const orderId1 = insertOrder.run(userId, "ORD123456", "Entregue", 129.99).lastInsertRowid
  const orderId2 = insertOrder.run(userId, "ORD789012", "Processando", 94.98).lastInsertRowid

  // Add order items
  const insertOrderItem = db.prepare(
    "INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)",
  )
  insertOrderItem.run(orderId1, 1, "Wireless Headphones", 1, 129.99)
  insertOrderItem.run(orderId2, 6, "Coffee Mug", 2, 14.99)
  insertOrderItem.run(orderId2, 8, "Desk Lamp", 1, 49.99)
}

// User types
export interface UserWithPassword extends User {
  password: string
}

// User functions
export async function getUserByEmail(email: string): Promise<UserWithPassword | null> {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase())

  if (!user) return null

  // Get user address
  const address = db.prepare("SELECT * FROM user_addresses WHERE user_id = ?").get(user.id)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title,
    gender: user.gender,
    country: user.country,
    ageGroup: user.age_group,
    marketingEmails: Boolean(user.marketing_emails),
    productUpdates: Boolean(user.product_updates),
    address: address
      ? {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zip_code,
        }
      : undefined,
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id)

  if (!user) return null

  // Get user address
  const address = db.prepare("SELECT * FROM user_addresses WHERE user_id = ?").get(user.id)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    title: user.title,
    gender: user.gender,
    country: user.country,
    ageGroup: user.age_group,
    marketingEmails: Boolean(user.marketing_emails),
    productUpdates: Boolean(user.product_updates),
    address: address
      ? {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zip_code,
        }
      : undefined,
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    // Use hashSync instead of hash to avoid Promise issues
    const hashedPassword = hashSync(password, 10)
    const insertUser = db.prepare(`
      INSERT INTO users (
        name, 
        email, 
        password
      ) VALUES (?, ?, ?)
    `)

    const result = insertUser.run(name, email.toLowerCase(), hashedPassword)

    if (result.lastInsertRowid) {
      return {
        id: Number(result.lastInsertRowid),
        name,
        email: email.toLowerCase(),
      }
    }
    return null
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function updateUserProfile(userId: number, userData: Partial<User>): Promise<boolean> {
  try {
    const updateUser = db.prepare(`
      UPDATE users SET 
        name = COALESCE(?, name), 
        email = COALESCE(?, email),
        title = COALESCE(?, title),
        gender = COALESCE(?, gender),
        country = COALESCE(?, country),
        age_group = COALESCE(?, age_group),
        marketing_emails = COALESCE(?, marketing_emails),
        product_updates = COALESCE(?, product_updates)
      WHERE id = ?
    `)

    updateUser.run(
      userData.name || null,
      userData.email?.toLowerCase() || null,
      userData.title || null,
      userData.gender || null,
      userData.country || null,
      userData.ageGroup || null,
      userData.marketingEmails === undefined ? null : Number(userData.marketingEmails),
      userData.productUpdates === undefined ? null : Number(userData.productUpdates),
      userId,
    )

    if (userData.address) {
      // Check if address exists
      const existingAddress = db.prepare("SELECT * FROM user_addresses WHERE user_id = ?").get(userId)

      if (existingAddress) {
        const updateAddress = db.prepare(
          "UPDATE user_addresses SET street = ?, city = ?, state = ?, zip_code = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        )
        updateAddress.run(
          userData.address.street,
          userData.address.city,
          userData.address.state,
          userData.address.zipCode,
          userId,
        )
      } else {
        const insertAddress = db.prepare(
          "INSERT INTO user_addresses (user_id, street, city, state, zip_code) VALUES (?, ?, ?, ?, ?)",
        )
        insertAddress.run(
          userId,
          userData.address.street,
          userData.address.city,
          userData.address.state,
          userData.address.zipCode,
        )
      }
    }

    return true
  } catch (error) {
    console.error("Error updating user:", error)
    return false
  }
}

export async function verifyPassword(user: UserWithPassword, password: string): Promise<boolean> {
  // Use compareSync instead of compare to avoid Promise issues
  return compareSync(password, user.password)
}

export async function getUserOrders(userId: number) {
  const orders = db
    .prepare(`
    SELECT o.id, o.order_number, o.status, o.total, o.created_at
    FROM orders o
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `)
    .all(userId) as OrderRecord[]

  // Get items for each order
  const result = orders.map((order: OrderRecord) => {
    const items = db
      .prepare(`
      SELECT product_name, quantity, price
      FROM order_items
      WHERE order_id = ?
    `)
      .all(order.id) as OrderItemRecord[]

    return {
      id: order.order_number,
      date: new Date(order.created_at).toISOString().split("T")[0],
      status: order.status,
      total: order.total,
      items: items.map((item: OrderItemRecord) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      })),
    }
  })

  return result
}

// Password reset functions
export async function createPasswordResetToken(email: string): Promise<string | null> {
  try {
    // Find user by email
    const user = await getUserByEmail(email)
    if (!user) return null

    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex")

    // Set expiration to 1 hour from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    // Delete any existing tokens for this user
    db.prepare("DELETE FROM password_reset_tokens WHERE user_id = ?").run(user.id)

    // Insert new token
    const insertToken = db.prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)")
    insertToken.run(user.id, token, expiresAt.toISOString())

    return token
  } catch (error) {
    console.error("Error creating password reset token:", error)
    return null
  }
}

export async function verifyPasswordResetToken(token: string): Promise<number | null> {
  try {
    // Find token in database
    const resetToken = db
      .prepare(`
      SELECT * FROM password_reset_tokens 
      WHERE token = ? AND expires_at > datetime('now')
    `)
      .get(token)

    if (!resetToken) return null

    return resetToken.user_id
  } catch (error) {
    console.error("Error verifying password reset token:", error)
    return null
  }
}

export async function resetPassword(userId: number, newPassword: string): Promise<boolean> {
  try {
    // Hash the new password - use hashSync instead of hash
    const hashedPassword = hashSync(newPassword, 10)

    // Update user's password
    const updatePassword = db.prepare("UPDATE users SET password = ? WHERE id = ?")
    updatePassword.run(hashedPassword, userId)

    // Delete all reset tokens for this user
    db.prepare("DELETE FROM password_reset_tokens WHERE user_id = ?").run(userId)

    return true
  } catch (error) {
    console.error("Error resetting password:", error)
    return false
  }
}

export default db
