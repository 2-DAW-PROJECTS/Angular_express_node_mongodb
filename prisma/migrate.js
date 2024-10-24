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
              email: enterprise.contact_email || `${enterprise.name}@jobhunter.com`,
              username: enterprise.name
            },
            update: {
              description: enterprise.description,
              industry: enterprise.industry,
              location: enterprise.location,
              logo: enterprise.logo,
              website: enterprise.website,
              telephone: enterprise.contact_phone,
              image: enterprise.image,
              slug: enterprise.slug,
              category: enterprise.category
            },
            create: {
              username: enterprise.name,
              email: enterprise.contact_email || `${enterprise.name}@jobhunter.com`,
              password: "defaultPassword123",
              description: enterprise.description,
              industry: enterprise.industry,
              location: enterprise.location,
              logo: enterprise.logo,
              website: enterprise.website,
              telephone: enterprise.contact_phone,
              image: enterprise.image,
              slug: enterprise.slug,
              category: enterprise.category,
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
