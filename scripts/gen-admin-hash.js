/**
 * Admin panel şifresi için bcrypt hash üretir.
 * Kullanım: node scripts/gen-admin-hash.js [ŞİFRE]
 * Örnek: node scripts/gen-admin-hash.js Admin123!
 */
const password = process.argv[2] || 'Admin123!';
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch {
  console.error('Hata: bcryptjs yüklü değil. Önce: npm install');
  process.exit(1);
}
const hash = bcrypt.hashSync(password, 10);
console.log('Şifre:', password);
console.log('ADMIN_PASS_HASH (bunu .env.local içine yapıştırın):');
console.log(hash);
