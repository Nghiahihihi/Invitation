/**
 * Google Apps Script — dán vào Extensions > Apps Script trong Google Sheet
 *
 * Cấu trúc sheet:
 *   Cột A: Người gửi (tên bạn bè / mối quan hệ, để bạn biết gửi cho ai)
 *   Cột B: Tên hiện trên thiệp (ví dụ: Nguyễn Văn An)
 *   Cột C: Link (script tự điền)
 *
 * Cách dùng:
 *   1. Mở Google Sheet, vào Extensions > Apps Script
 *   2. Paste toàn bộ file này vào, Save
 *   3. Chạy generateLinks() một lần để điền cột C
 *   4. Mỗi lần thêm khách mới, chạy lại — chỉ điền những dòng chưa có link
 */

const SITE_URL = 'https://your-site.com' // ← đổi thành domain thật sau khi deploy
const SHEET_NAME = 'Sheet1'              // ← đổi nếu tên sheet khác

function generateLinks() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
  const lastRow = sheet.getLastRow()

  for (let row = 2; row <= lastRow; row++) { // bắt đầu từ dòng 2 (dòng 1 là header)
    const name = sheet.getRange(row, 2).getValue().toString().trim()
    if (!name) continue

    // Chỉ điền nếu cột C chưa có link
    const existing = sheet.getRange(row, 3).getValue()
    if (existing) continue

    const encoded = Utilities.base64Encode(name, Utilities.Charset.UTF_8)
    const link = `${SITE_URL}/#${encoded}`
    sheet.getRange(row, 3).setValue(link)
  }

  SpreadsheetApp.getUi().alert('Xong! Cột C đã được điền link.')
}

// Thêm menu "Thiệp" vào Google Sheet cho tiện
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Thiệp')
    .addItem('Generate links', 'generateLinks')
    .addToUi()
}
