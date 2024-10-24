const { PrismaClient } = require('@prisma/client');
const { MongoClient } = require('mongodb');

const prisma = new PrismaClient();
const mongoUri = 'mongodb://mongo:27017/infojobs?replicaSet=rs0';

async function migrate() {
  const mongoClient = new MongoClient(mongoUri);

  try {
    await mongoClient.connect();
    const db = mongoClient.db();
    const enterprises = db.collection('enterprises');
    const enterprisesData = await enterprises.find().toArray();

    for (const enterprise of enterprisesData) {
        await prisma.userEnterprise.upsert({
            where: {
              email: enterprise.contact_email,
              username: enterprise.name
            },
            update: {
              telephone: enterprise.contact_phone,
              usertype: "enterprise",
              isActive: true,
              permissions: ["read", "write"],
              followers: 0
            },
            create: {
              username: enterprise.name,
              email: enterprise.contact_email,
              password: "defaultPassword123",
              telephone: enterprise.contact_phone,
              usertype: "enterprise",
              isActive: true,
              permissions: ["read", "write"],
              followers: 0
            }
          });
          
          
          
    }
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
}

migrate();
