import mongoose from 'mongoose';

const DB_URI = 'mongodb+srv://onion-erp-user:onionerp123@ac-smq1wjf-shard-00-01.ba8i6oa.mongodb.net/onion-erp?retryWrites=true&w=majority';

async function checkData() {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connected to DB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const pos = await mongoose.connection.db.collection('purchaseorders').find({}).limit(5).toArray();
    console.log('Sample Purchase Orders:', JSON.stringify(pos, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkData();
