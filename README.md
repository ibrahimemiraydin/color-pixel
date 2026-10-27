# Color Pixel

Chrome ve Chromium tabanlı masaüstü tarayıcılar için WXT + React + TypeScript + Tailwind CSS ile hazırlanmış Manifest V3 uzantısı.

## Sürüm — 0.2.1

- Yeni Color Pixel ikonu: koyu zemin, lime piksel C ve turkuaz renk örneği.
- Tarayıcı uzantı ikonu, panel başlığı ve sekme simgesi aynı tasarımı kullanır.
- Düzenlenebilir kaynak: `public/icon/color-pixel.svg`. PNG boyutları: 16, 32, 48, 128 ve 512 px.
- Kaynaktan PNG'leri yeniden oluşturmak için `npm run icons` çalıştırın.

- Uygulama adı: **Color Pixel**. Proje klasörü güncelleme kolaylığı için `color-picker` olarak korunur.
- Türkçe ve İngilizce arayüz; sağ üst köşeden dil seçimi ve cihazda kalıcı dil tercihi.
- İlk açılışta tarayıcı dili Türkçeyse Türkçe, diğer dillerde İngilizce seçilir.
- Uzantı açıklaması tarayıcı dilini, panel metinleri paneldeki dil seçimini izler. Color Pixel adı her iki dilde de aynıdır.

- Yerleşik EyeDropper API ile ekrandan piksel rengi seçme; Esc ile iptal.
- HEX, RGB, HSL gösterimi ve ayrı kopyalama düğmeleri.
- 3 veya 6 haneli HEX kodu girme.
- Tekrarsız son 20 renk; cihazda kalıcı saklama ve geçmişi temizleme.
- Türkçe/İngilizce, klavye erişilebilir, koyu açılır panel.

## Çalıştırma

Node.js 22+ ve npm gerekir.

```sh
npm ci
npm run dev
```

Geliştirme sırasında `.output/chrome-mv3-dev` klasörünü uzantı olarak yükleyin. Dosya değişikliklerini WXT izler. Tarayıcı otomatik başlatma bağımlılığı bu temel sürümde kurulmamıştır.

## Chrome / Edge / Brave kurulumu

```sh
npm run build
```

1. Chrome'da `chrome://extensions`, Edge'de `edge://extensions`, Brave'de `brave://extensions` adresini açın.
2. Geliştirici modunu açın.
3. **Paketlenmemiş öğe yükle** seçeneğiyle projenin `.output/chrome-mv3` klasörünü seçin.
4. Uzantıyı araç çubuğuna sabitleyin. Paneli açıp **Ekrandan renk seç** düğmesine basın.

## Doğrulama ve paketleme

```sh
npm run check
npm test
npm run build
npm run zip
```

Otomatik uzantı testi için `npx playwright install chromium` ardından `npm run test:e2e` çalıştırın. Windows'ta kurulu Edge ile çalıştırmak için PowerShell'de `$env:PLAYWRIGHT_CHANNEL='msedge'; npm run test:e2e` kullanılabilir.

Bu ortamda tür denetimi, 12 birim testi, üretim derlemesi ve Edge üzerinde uzantı testi geçti. Otomatik test HEX girişini, geçersiz girişleri, gerçek panoya kopyala/yapıştırmayı, kalıcı geçmişi, 20 renk sınırını ve temizlemeyi kontrol eder. EyeDropper başarı/iptal sonuçları testte taklit edilir; gerçek ekran pikseli seçimi ve araç çubuğu panelinin odak davranışı elle test edilmelidir. Chrome ve Brave üzerinde manuel doğrulama yapılmadı.

Üretim çıktısı `.output/chrome-mv3`, dağıtım ZIP'i `.output` içindedir. ZIP, tarayıcı mağazasında yayınlanmış bir sürüm değildir.

## İzinler ve veri

`storage`, son 20 rengi cihazda tutar. `clipboardWrite`, kullanıcı renk kodunu kopyaladığında panoya yazar. İçerik betiği, sunucu, analiz, hesap veya web sayfalarına erişim izni yoktur. Geçmiş tarayıcılar arasında eşitlenmez. Uzantıyı kaldırmak verileri siler.

EyeDropper destekleyen masaüstü Chromium tarayıcısı gerekir (Chrome 95+). Damlalık bir düğmeye basıldığında başlatılır ve renk seçimi kullanıcı tıklamasıyla tamamlanır. Desteklenmeyen tarayıcılarda HEX girişi kullanılabilir. Firefox hedeflenmemiştir.

## Tarayıcıda manuel kontrol

- Ekrandan açık ve koyu renk seçin; panelin sonucu ve geçmişi göstermesini kontrol edin.
- Esc ile iptal edin; önceki rengin korunduğunu doğrulayın.
- Üç formatı kopyalayıp bir metin alanına yapıştırın.
- `#abc`, `FF00AA` ve geçersiz HEX girişlerini deneyin.
- Paneli kapatıp açın; geçmişin korunduğunu doğrulayın.
- Aynı rengi tekrar seçin; yalnızca bir kez görünmeli. Geçmişi temizleyip yeniden açın.
- Chrome, Edge ve Brave üzerinde ayrı ayrı deneyin; üretim derlemesi tek başına tarayıcı testi değildir.

## Sonraki adımlar

Favori paletler, CSS/JSON dışa aktarma, format tercihi ve kontrast kontrolü ayrı geliştirmeler olarak eklenebilir.

`extension-key.json` yalnızca herkese açık bir anahtar içerir; geliştirme sırasında uzantı kimliğinin sabit kalmasını sağlar. Mağaza yayını aşamasında mağazanın atadığı kimlikle eşleştirilmelidir.
