// ─────────────────────────────────────────────────────────────────────────────
// TradeLog — Google Sheets Sync
// Paste this entire file into Extensions → Apps Script in the Google Sheet.
// Deploy as Web App: Execute as Me · Who has access: Anyone
// ─────────────────────────────────────────────────────────────────────────────

var HEADERS = [
  'ID', 'Date', 'Symbol', 'Direction',
  'Entry $', 'Exit $', 'Qty',
  'P&L $', 'P&L %', 'Result',
  'Why I Entered', 'What Happened', 'Key Lesson',
  'Emotion', 'Rating', 'AI Insight', 'Created At'
];

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function ensureHeaders(sheet) {
  var firstCell = sheet.getRange(1, 1).getValue();
  if (firstCell !== 'ID') {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#070B12');
    headerRange.setFontColor('#F5B800');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1,  180); // ID
    sheet.setColumnWidth(2,  100); // Date
    sheet.setColumnWidth(3,  80);  // Symbol
    sheet.setColumnWidth(4,  80);  // Direction
    sheet.setColumnWidth(5,  80);  // Entry
    sheet.setColumnWidth(6,  80);  // Exit
    sheet.setColumnWidth(7,  60);  // Qty
    sheet.setColumnWidth(8,  90);  // P&L $
    sheet.setColumnWidth(9,  70);  // P&L %
    sheet.setColumnWidth(10, 70);  // Result
    sheet.setColumnWidth(11, 280); // Why entered
    sheet.setColumnWidth(12, 280); // What happened
    sheet.setColumnWidth(13, 280); // Key lesson
    sheet.setColumnWidth(14, 90);  // Emotion
    sheet.setColumnWidth(15, 60);  // Rating
    sheet.setColumnWidth(16, 320); // AI Insight
    sheet.setColumnWidth(17, 160); // Created At
  }
}

function tradeToRow(t) {
  return [
    t.id          || '',
    t.date        || '',
    t.symbol      || '',
    t.direction   || '',
    t.entryPrice  || 0,
    t.exitPrice   || 0,
    t.quantity    || 0,
    typeof t.pnl === 'number' ? Math.round(t.pnl * 100) / 100 : 0,
    typeof t.pnlPercent === 'number' ? Math.round(t.pnlPercent * 10) / 10 : 0,
    t.isWin ? 'WIN' : 'LOSS',
    t.whyEntered    || '',
    t.whatHappened  || '',
    t.keyLesson     || '',
    t.emotion       || '',
    t.rating        || '',
    t.aiInsight     || '',
    t.createdAt     || ''
  ];
}

function findRowById(sheet, id) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) return i + 2; // 1-indexed, skip header
  }
  return -1;
}

function colorRow(sheet, rowNum, isWin) {
  var bg = isWin ? '#0a1f14' : '#1f0a0a';
  var resultBg = isWin ? '#00C896' : '#FF3D5A';
  sheet.getRange(rowNum, 1, 1, HEADERS.length).setBackground(bg);
  sheet.getRange(rowNum, 10).setBackground(resultBg).setFontColor('#ffffff').setFontWeight('bold');
}

function upsertTrade(sheet, trade) {
  var row = tradeToRow(trade);
  var existing = findRowById(sheet, trade.id);
  if (existing > 0) {
    sheet.getRange(existing, 1, 1, row.length).setValues([row]);
    colorRow(sheet, existing, trade.isWin);
  } else {
    // Insert after header (row 2) so newest trades appear at top
    if (sheet.getLastRow() < 2) {
      sheet.appendRow(row);
      colorRow(sheet, sheet.getLastRow(), trade.isWin);
    } else {
      sheet.insertRowAfter(1);
      sheet.getRange(2, 1, 1, row.length).setValues([row]);
      colorRow(sheet, 2, trade.isWin);
    }
  }
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = getSheet();
    ensureHeaders(sheet);

    if (payload.action === 'upsert' && payload.trade) {
      upsertTrade(sheet, payload.trade);

    } else if (payload.action === 'delete' && payload.id) {
      var rowNum = findRowById(sheet, payload.id);
      if (rowNum > 0) sheet.deleteRow(rowNum);

    } else if (payload.action === 'syncAll' && Array.isArray(payload.trades)) {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
      for (var i = 0; i < payload.trades.length; i++) {
        var trade = payload.trades[i];
        var row = tradeToRow(trade);
        sheet.appendRow(row);
        colorRow(sheet, sheet.getLastRow(), trade.isWin);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// For testing the script manually from the editor
function testUpsert() {
  var sheet = getSheet();
  ensureHeaders(sheet);
  upsertTrade(sheet, {
    id: 'test-123',
    date: '2025-01-01',
    symbol: 'AAPL',
    direction: 'long',
    entryPrice: 150,
    exitPrice: 160,
    quantity: 10,
    pnl: 100,
    pnlPercent: 6.67,
    isWin: true,
    whyEntered: 'Strong breakout',
    whatHappened: 'Ran to target',
    keyLesson: 'Trust the setup',
    emotion: 'confident',
    rating: 4,
    aiInsight: 'Good discipline.',
    createdAt: new Date().toISOString()
  });
  Logger.log('Done');
}
