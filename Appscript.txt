/**
 * SAGU Laptop Loan — Google Apps Script backend
 *
 * CARA PAKAI:
 * 1. Buka Google Sheet baru, buat baris header di sheet pertama persis seperti ini (kolom A-K):
 *    Timestamp | Nama | No Hp | Email | Laptop No | Tanggal | Jam | Perlengkapan | Status | Keperluan | Keterangan Lainnya
 * 2. Buka menu Extensions > Apps Script, hapus isi default, lalu tempel kode ini.
 * 3. Klik Deploy > New deployment > pilih tipe "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Salin URL Web App yang dihasilkan, tempel ke variabel SCRIPT_URL
 *    di file assets/js/script.js pada project SAGU Laptop Loan.
 */

const SHEET_NAME = 'Sheet1'; // sesuaikan dengan nama sheet yang dipakai

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.nama,
    data.noHp,
    data.email,
    data.laptopNo,
    data.tanggal,
    data.jam,
    data.perlengkapan,
    data.status,
    data.keperluan,
    data.keteranganLain
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
