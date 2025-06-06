const mongoose = require('mongoose');

// 連接到 MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定義一個 Schema
const messageSchema = new mongoose.Schema({
  name: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

// 建立集合（Mongoose 會自動建立名為 'messages' 的集合）
const Message = mongoose.model('Message', messageSchema);

// 插入文件
const message = new Message({ name: 'Alice', message: 'Hello, MongoDB!' });

message.save()
  .then(() => console.log('Message saved'))
  .catch(err => console.error('Error:', err))
  .finally(() => mongoose.connection.close());
