// lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'vieclab.com', // nếu deploy thì điền IP/VPS ở đây
  user: 'root',
  password: '', // nếu bạn đặt mật khẩu thì nhập vào
  database: 'vieclab',
});

export default pool;

