export default function MesafeliSatisPage() {
  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "120px 24px 96px",
        lineHeight: 1.75,
        color: "#f5f5f5",
      }}
    >
      <h1
        style={{
          fontSize: 34,
          marginBottom: 32,
          fontWeight: 700,
          letterSpacing: 0.4,
        }}
      >
        Mesafeli Satış Sözleşmesi
      </h1>

      <p style={{ opacity: 0.9 }}>
        İşbu Mesafeli Satış Sözleşmesi (“<strong>Sözleşme</strong>”), aşağıda
        bilgileri yer alan <strong>Satıcı</strong> ile <strong>Alıcı</strong>
        arasında, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği hükümleri uyarınca elektronik ortamda kurulmuştur.
      </p>

      <section style={{ marginTop: 40 }}>
        <h2>1. Taraflar</h2>

        <p>
          <strong>Satıcı:</strong> MSM Periyodik Danışmanlık Ticaret Limited Şirketi
        </p>
        <p>
          <strong>Vergi Kimlik No (VKN):</strong> 6231106746
        </p>
        <p>
          <strong>Adres:</strong> Adalet Mahallesi Manas Bulvarı No:39 Folkart Towers
          B Kule Kat:38 Daire:3803 Bayraklı / İzmir
        </p>

        <p style={{ marginTop: 16 }}>
          <strong>Alıcı:</strong> Web sitesi üzerinden sipariş veren gerçek veya
          tüzel kişi.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>2. Sözleşmenin Konusu</h2>
        <p>
          İşbu Sözleşme’nin konusu, Alıcı’nın Satıcı’ya ait internet sitesi
          üzerinden elektronik ortamda siparişini verdiği ürünlerin satışı ve
          teslimine ilişkin tarafların hak ve yükümlülüklerinin belirlenmesidir.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>3. Ürün Bilgileri ve Fiyat</h2>
        <p>
          Ürünlerin cinsi, türü, miktarı, satış bedeli ve ödeme şekli; sipariş
          öncesinde ve sipariş anında Alıcı’ya açıkça bildirilmektedir.
        </p>
        <p>
          Belirtilen fiyatlara, varsa vergiler dâhildir ve ödeme işlemi Alıcı
          tarafından onaylandığında geçerlilik kazanır.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>4. Teslimat</h2>
        <p>
          Ürün, Alıcı tarafından belirtilen teslimat adresine ve belirtilen kişi
          veya kuruluşa, yasal süreler içerisinde teslim edilir.
        </p>
        <p>
          Teslimat süresi, her hâlükârda yasal azami süre olan 30 (otuz) günü
          aşmayacaktır.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>5. Cayma Hakkı</h2>
        <p>
          Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde
          herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma
          hakkını kullanabilir.
        </p>
        <p>
          Cayma hakkının kullanılması için bu süre içerisinde Satıcı’ya yazılı
          bildirimde bulunulması gerekmektedir.
        </p>
        <p>
          <strong>Önemli Not:</strong> Kişiye özel olarak hazırlanan, Alıcı’nın
          talepleri doğrultusunda üretilen veya kişiselleştirilen ürünlerde cayma
          hakkı kullanılamaz.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>6. Cayma Hakkının Kullanılamayacağı Haller</h2>
        <ul>
          <li>Alıcı’nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan ürünler</li>
          <li>Hijyen açısından iadesi uygun olmayan ürünler</li>
          <li>Tesliminden sonra ambalajı açılan ve tekrar satışı mümkün olmayan ürünler</li>
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>7. Bedel İadesi</h2>
        <p>
          Cayma hakkının usulüne uygun kullanılması hâlinde, ürün bedeli ve varsa
          teslimat masrafları, cayma bildiriminin Satıcı’ya ulaşmasını takiben
          14 (on dört) gün içerisinde Alıcı’ya iade edilir.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>8. Genel Hükümler</h2>
        <ul>
          <li>
            Alıcı, internet sitesinde yer alan sözleşme şartlarını okuyup
            kabul ettiğini beyan eder.
          </li>
          <li>
            Satıcı, mücbir sebepler nedeniyle sözleşmeden doğan yükümlülüklerini
            yerine getiremezse sorumlu tutulamaz.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>9. Yetkili Mahkeme</h2>
        <p>
          İşbu Sözleşme’den doğabilecek uyuşmazlıklarda, Tüketici Hakem
          Heyetleri ve Tüketici Mahkemeleri yetkilidir.
        </p>
      </section>

      <section style={{ marginTop: 48, opacity: 0.85 }}>
        <p>
          İşbu Mesafeli Satış Sözleşmesi, elektronik ortamda onaylandığı tarihte
          yürürlüğe girer.
        </p>
      </section>
    </main>
  );
}
