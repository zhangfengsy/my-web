const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// 数据库
const db = new sqlite3.Database('./database.db');

// 创建表
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  action TEXT,
  time DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// =======================
// 自动导入你所有的账号
// =======================
const ALL_USERS = {
  "王欣宇":"224","李永博":"787","张芮崎":"197","姚国平":"478","张凯":"432","张质斌":"476","周平平":"361","迟凯琳":"978","贾佳":"183","张珈诺":"357","苟萌迪":"329","唐东方":"165","周莉娟":"519","初东阳":"538","王昌森":"362","赵帆":"963","王晓燕":"372","孙硕":"647","杨骁琪":"611","张万青":"585","赵姝艳":"536","鞠宜晓":"895","孙庆峰":"481","刘歆媛":"913","唐欣雨":"716","吴双":"954","韩博文":"361","田密":"462","徐同乐":"834","张昊":"587","李永明":"824","卞靖恺":"126","辛子琪":"374","王翰":"169","谢振勇":"985","李佳奇":"425","王云龙":"847","王森":"315","李梦园":"283","银小忠":"131","兰子航":"447","杨海胜":"716","赵敏":"565","刘洋洋":"863","宋丽娜":"948","唐瑞发":"811","李俊伟":"727","刘畅":"421","王文静":"858","王雅娟":"828","高大超":"553","邱兆霞":"236","曾潇":"153","王文慧":"159","孙铭悦":"147","王小丹":"392","业务三部-王欣宇":"951","业务三部-王昌森":"994","业务二部":"308","业务一部":"178","启航部":"337","三部一组":"994","三部二组":"323","三部三组":"340","三部四组":"154","三部五组":"421","三部六组":"342","三部七组":"333","二部一组":"412","二部二组":"349","二部三组":"153","二部四组":"666","一部二组":"999","启航组":"337","总览":"9999","admin":"admin888"
};

// 初始化账号（只执行一次）
function initUsers() {
  for (let user in ALL_USERS) {
    let pwd = ALL_USERS[user];
    db.run(`INSERT OR IGNORE INTO users (username,password) VALUES (?,?)`, [user, pwd]);
  }
}
initUsers();

// 登录接口
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username=? AND password=?`, [username, password], (err, row) => {
    if (row) {
      db.run(`INSERT INTO logs (username,action) VALUES (?,?)`, [username, '登录成功']);
      res.json({ success: true });
    } else {
      db.run(`INSERT INTO logs (username,action) VALUES (?,?)`, [username || '未知', '登录失败']);
      res.json({ success: false });
    }
  });
});

// 查看日志
app.get('/api/logs', (req, res) => {
  db.all(`SELECT * FROM logs ORDER BY time DESC`, (err, rows) => {
    res.json(rows);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('服务已启动');
});