#!/bin/sh
# 404 alıyorsanız: önbelleği temizleyip dev sunucusunu başlatın.
# Kullanım: ./scripts/dev-clean.sh   veya  sh scripts/dev-clean.sh
cd "$(dirname "$0")/.."
echo "Temizleniyor: .next"
rm -rf .next
echo "Dev sunucusu başlatılıyor..."
echo "Tarayıcıda açın: http://localhost:3000 (veya terminalde yazan port)"
npm run dev
