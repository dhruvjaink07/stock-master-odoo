import { MongoClient } from 'mongodb';
import { hashPassword } from './utils/auth';
import { v4 as uuidv4 } from 'uuid';

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/stockmaster';

async function main() {
  console.log('🌱 Seeding database...');
  
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db('stockmaster');

    // 1. Create users
    const adminPassword = await hashPassword('admin123');
    const managerPassword = await hashPassword('manager123');
    const userPassword = await hashPassword('user123');

    const usersCollection = db.collection('users');
    const adminId = uuidv4();
    const managerId = uuidv4();
    const userId = uuidv4();

    await usersCollection.insertMany([
      {
        _id: adminId as any,
        email: 'admin@stockmaster.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: managerId as any,
        email: 'manager@stockmaster.com',
        password: managerPassword,
        name: 'Manager User',
        role: 'MANAGER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: userId as any,
        email: 'user@stockmaster.com',
        password: userPassword,
        name: 'Regular User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('✓ Users created');

    // 2. Create warehouses
    const warehousesCollection = db.collection('warehouses');
    const warehouse1Id = uuidv4();
    const warehouse2Id = uuidv4();

    await warehousesCollection.insertMany([
      {
        _id: warehouse1Id as any,
        name: 'Main Warehouse - New York',
        location: 'New York, NY',
        capacity: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: warehouse2Id as any,
        name: 'Secondary Warehouse - Los Angeles',
        location: 'Los Angeles, CA',
        capacity: 5000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('✓ Warehouses created');

    // 3. Create products
    const productsCollection = db.collection('products');
    const product1Id = uuidv4();
    const product2Id = uuidv4();
    const product3Id = uuidv4();
    const product4Id = uuidv4();

    await productsCollection.insertMany([
      {
        _id: product1Id as any,
        sku: 'SKU-001-LAPTOP',
        name: 'Laptop Pro 15',
        category: 'Electronics',
        description: 'High-performance laptop with 15-inch display',
        reorderThreshold: 10,
        unitPrice: 999.99,
        decimals: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: product2Id as any,
        sku: 'SKU-002-MOUSE',
        name: 'Wireless Mouse',
        category: 'Accessories',
        description: 'Portable wireless mouse with 2.4GHz receiver',
        reorderThreshold: 50,
        unitPrice: 29.99,
        decimals: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: product3Id as any,
        sku: 'SKU-003-COFFEE',
        name: 'Coffee Beans 1Kg',
        category: 'Beverages',
        description: 'Premium arabica coffee beans',
        reorderThreshold: 100,
        unitPrice: 12.50,
        decimals: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: product4Id as any,
        sku: 'SKU-004-MONITOR',
        name: '4K Monitor 27inch',
        category: 'Electronics',
        description: '4K UHD display monitor',
        reorderThreshold: 5,
        unitPrice: 399.99,
        decimals: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('✓ Products created');

    // 4. Create initial stock levels
    const stockLevelsCollection = db.collection('stock_levels');
    await stockLevelsCollection.insertMany([
      {
        _id: uuidv4() as any,
        productId: product1Id,
        warehouseId: warehouse1Id,
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4() as any,
        productId: product2Id,
        warehouseId: warehouse1Id,
        quantity: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4() as any,
        productId: product3Id,
        warehouseId: warehouse2Id,
        quantity: 500,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4() as any,
        productId: product4Id,
        warehouseId: warehouse2Id,
        quantity: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('✓ Stock levels created');

    // 5. Create sample receipt
    const receiptsCollection = db.collection('receipts');
    const receiptId = uuidv4();
    
    await receiptsCollection.insertOne({
      _id: receiptId as any,
      receiptNumber: 'REC-2025-001',
      status: 'VALIDATED',
      totalQuantity: 100,
      notes: 'Initial stock receipt from supplier',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const receiptItemsCollection = db.collection('receipt_items');
    await receiptItemsCollection.insertMany([
      {
        _id: uuidv4() as any,
        receiptId: receiptId,
        productId: product1Id,
        warehouseId: warehouse1Id,
        quantity: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: uuidv4() as any,
        receiptId: receiptId,
        productId: product2Id,
        warehouseId: warehouse1Id,
        quantity: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('✓ Sample receipt created');

    // 6. Create stock ledger entries
    const ledgersCollection = db.collection('stock_ledgers');
    await ledgersCollection.insertOne({
      _id: uuidv4() as any,
      productId: product1Id,
      warehouseId: warehouse1Id,
      type: 'RECEIPT',
      quantity: 30,
      previousQty: 20,
      newQty: 50,
      reference: 'REC-2025-001',
      notes: 'Initial receipt from supplier ABC',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✓ Ledger entries created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Seed Summary:');
    console.log(`   ✓ Users: 3 created`);
    console.log(`     - admin@stockmaster.com (password: admin123)`);
    console.log(`     - manager@stockmaster.com (password: manager123)`);
    console.log(`     - user@stockmaster.com (password: user123)`);
    console.log(`   ✓ Warehouses: Main Warehouse - New York, Secondary Warehouse - Los Angeles`);
    console.log(`   ✓ Products: 4 created`);
    console.log(`   ✓ Stock Levels: 4 created`);
    console.log(`   ✓ Sample Receipt: REC-2025-001`);
    console.log(`\n🔑 Test Credentials:`);
    console.log(`   Email: admin@stockmaster.com`);
    console.log(`   Password: admin123`);
    console.log(`\n🚀 Server: http://localhost:3000`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await client.close();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  });
