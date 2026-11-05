# Kampüs Etkinlik Platformu

Kampüs etkinliklerini listeleyen, türe göre filtreleyen ve başlık/yer araması sunan küçük bir web uygulaması. Öneri formu yalnızca tarayıcıda doğrulama ve teşekkür iletisi gösterir; önerileri sunucuya kaydetmez.

## Gereksinimler ve çalıştırma
Node.js LTS ve bir web tarayıcısı gerekir. Harici npm paketi kullanılmaz.

1. Bu projenin ZIP dosyasını açın.
2. Uçbirimde `package.json` dosyasının bulunduğu `etkinlik-platformu` klasörüne geçin.
3. `npm start` çalıştırın.
4. `http://localhost:3000` adresini açın.
5. Durdurmak için Ctrl+C kullanın.

Port3000 başka bir program tarafından kullanılıyorsa önce o programı durdurun. HTML dosyasını doğrudan açmak yerine Node sunucusunu kullanın.

Depo: https://github.com/dakkarri/bmh231-odev2

Git ile indirmek için:

```sh
git clone https://github.com/dakkarri/bmh231-odev2.git
cd bmh231-odev2
npm start
```

## Dosyalar
- `sunucu.js`: http/fs/path ile statik dosyalar ve JSON API.
- `etkinlikler.json`: altı etkinliğin verileri.
- `public/index.html`: sayfa ve öneri formu.
- `public/stil.css`: duyarlı görünüm, Flexbox ve Grid.
- `public/betik.js`: fetch, kartlar, birleşik arama/filtre ve form doğrulama.
- `public/favicon.svg` ve `public/favicon.ico`: site simgesi ve tarayıcı yedeği.

## API
| Yöntem ve yol | Sonuç |
|---|---|
| GET /api/etkinlikler | 200, tüm etkinlikler |
| GET /api/etkinlikler?tur=atolye | 200, seçilen tür |
| GET /api/etkinlikler/3 | 200, tek etkinlik |
| GET /api/etkinlikler/999 | 404, JSON hata |
| GET / ve public altındaki dosyalar | 200, dosyanın uygun Content-Type değeri |
| Bulunmayan yol | 404, düz metin |
| GET dışındaki yöntemler | 405, düz metin ve Allow: GET |

Sunucu her isteğin yöntemini ve yolunu uçbirime yazar. public dışındaki dosyalar statik olarak sunulmaz.

## Ekran görüntüsü
![Masaüstü görünümü](docs/ekran-goruntusu.png)

Bu görüntü kod incelemesi sırasında yardımcı tarafından gerçek çalıştırmadan alınmıştır. Öğrencinin kişisel test kaydı olarak sunulmaz.

## İnceleme ve yardım notu
Bu README, sağlanan kodun çalışma biçimini açıklamak için yardımcı tarafından hazırlanmış inceleme taslağıdır. İnceleme sırasında .gitignore satır sonları, JavaScript Content-Type değeri ve Türkçe tarih yardımcı fonksiyonu düzeltildi. Eksik site simgesi sonradan eklendi. Bu belge bağımsız öğrenci yazarlığı, iki günlük commit geçmişi veya ödevin tümünün tamamlandığı iddiası içermez. Depo 5 Kasım2026 tarihinde yayımlandı. Commit tarihleri değiştirilmedi; iki güne yayılmış geliştirme geçmişi iddiası yoktur.
