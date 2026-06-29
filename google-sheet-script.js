const SITE_URL   = 'https://invitation-tau-vert.vercel.app'
const SHEET_NAME = 'Sheet1'

// ── Tạo link cho cột C ───────────────────────────
function generateLinks() {
  const sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
  const lastRow = sheet.getLastRow()

  for (let row = 2; row <= lastRow; row++) {
    const name = sheet.getRange(row, 2).getValue().toString().trim()
    if (!name) continue
    const existing = sheet.getRange(row, 3).getValue()
    if (existing) continue

    const encoded = Utilities.base64Encode(name, Utilities.Charset.UTF_8)
    const link    = `${SITE_URL}/#${encoded}`
    sheet.getRange(row, 3).setValue(link)
  }

  SpreadsheetApp.getUi().alert('Xong! Cot C da duoc dien link.')
}

// ── Nhận RSVP → ghi vào cột D E F G ────────────────────
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)

  // Ghi header D1:G1 nếu chưa có
  if (!sheet.getRange(1, 4).getValue()) {
    sheet.getRange(1, 4, 1, 4).setValues([['Ten (RSVP)', 'Link goc', 'Co den?', 'Thoi gian']])
  }

  const data = JSON.parse(e.postData.contents)
  const name = data.name || ''

  // Tìm dòng khớp tên trong cột B để lấy link cột C
  const lastRow = sheet.getLastRow()
  let matchRow  = -1
  for (let r = 2; r <= lastRow; r++) {
    if (sheet.getRange(r, 2).getValue().toString().trim() === name) {
      matchRow = r
      break
    }
  }
  const link = matchRow > 0 ? sheet.getRange(matchRow, 3).getValue() : ''

  // Ghi vào cột D E F G — tìm hàng trống đầu tiên từ D2
  let writeRow = 2
  while (sheet.getRange(writeRow, 4).getValue() !== '') writeRow++

  sheet.getRange(writeRow, 4, 1, 4).setValues([[
    name,
    link,
    data.attending === 'yes' ? 'Co den' : 'Khong den',
    new Date(data.timestamp).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
  ]])

  return ContentService.createTextOutput('ok')
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Thiep')
    .addItem('Generate links', 'generateLinks')
    .addToUi()
}
