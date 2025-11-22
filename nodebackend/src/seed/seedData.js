import User from "../models/User.js"
import Warehouse from "../models/Warehouse.js"
import Category from "../models/Category.js"
import Product from "../models/Product.js"

export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments()
    if (userCount > 0) {
      console.log("Database already seeded, skipping...")
      return
    }

    console.log("Seeding database...")

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@stockmaster.com",
      password: "password123",
      role: "admin",
      phone: "+1234567890",
    })

    // Create warehouses
    const mainWarehouse = await Warehouse.create({
      name: "Main Warehouse",
      code: "WH-MAIN",
      location: "New York, NY",
      capacity: 10000,
    })

    const secondaryWarehouse = await Warehouse.create({
      name: "Secondary Warehouse",
      code: "WH-SEC",
      location: "Los Angeles, CA",
      capacity: 5000,
    })

    // Create categories
    const furnitureCategory = await Category.create({
      name: "Furniture",
      description: "Office and home furniture items",
    })

    const materialsCategory = await Category.create({
      name: "Raw Materials",
      description: "Construction and industrial materials",
    })

    // Create products matching frontend seed data
    await Product.create([
      {
        sku: "SR001",
        name: "Steel Rods",
        category: materialsCategory._id,
        warehouse: mainWarehouse._id,
        quantity: 450,
        minStockLevel: 100,
        unit: "pcs",
        price: 25.5,
        description: "10mm steel rods for construction",
      },
      {
        sku: "C001",
        name: "Chairs",
        category: furnitureCategory._id,
        warehouse: mainWarehouse._id,
        quantity: 120,
        minStockLevel: 50,
        unit: "pcs",
        price: 89.99,
        description: "Office chairs with ergonomic design",
      },
      {
        sku: "S001",
        name: "Steel",
        category: materialsCategory._id,
        warehouse: secondaryWarehouse._id,
        quantity: 500,
        minStockLevel: 200,
        unit: "kg",
        price: 15.75,
        description: "High-grade steel sheets",
      },
      {
        sku: "D001",
        name: "Desks",
        category: furnitureCategory._id,
        warehouse: mainWarehouse._id,
        quantity: 45,
        minStockLevel: 20,
        unit: "pcs",
        price: 299.99,
        description: "Adjustable standing desks",
      },
      {
        sku: "CB001",
        name: "Cables",
        category: materialsCategory._id,
        warehouse: secondaryWarehouse._id,
        quantity: 8,
        minStockLevel: 50,
        unit: "meters",
        price: 5.99,
        description: "Electrical cables - LOW STOCK",
      },
      {
        sku: "SC001",
        name: "Screws",
        category: materialsCategory._id,
        warehouse: mainWarehouse._id,
        quantity: 0,
        minStockLevel: 500,
        unit: "pcs",
        price: 0.1,
        description: "M6 steel screws - OUT OF STOCK",
      },
    ])

    console.log("Database seeded successfully!")
    console.log("Admin credentials: admin@stockmaster.com / password123")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
