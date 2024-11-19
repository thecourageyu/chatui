const { MongoClient } = require('mongodb');
// const uri = 'mongodb://localhost:27017'; // 連接到本地的 MongoDB
const uri = 'mongodb://root:root123@mongo:27017'; // 連接到本地的 MongoDB

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    // 設置資料庫和集合
    const db = client.db('myDatabase');            // 設定資料庫
    const collection = db.collection('myCollection'); // 設定集合

    // (1) 建立資料庫和集合
    // MongoDB 不需明確建立資料庫和集合，插入資料時會自動建立

    // (2) 插入資料
    const document = { name: 'Alice', age: 25, city: 'New York' };
    const insertResult = await collection.insertOne(document);
    console.log('Inserted document:', insertResult.insertedId);

    // (3) 存取資料 (查詢)
    const query = { name: 'Alice' };
    const foundDocuments = await collection.find(query).toArray();
    console.log('Found documents:', foundDocuments);

    // (4) 刪除資料
    const deleteResult = await collection.deleteOne(query);
    console.log('Deleted documents count:', deleteResult.deletedCount);

    // (5) 刪除資料庫和集合
    // 刪除集合
    await collection.drop();
    console.log('Collection dropped');

    // 刪除資料庫
    await db.dropDatabase();
    console.log('Database dropped');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

run();
