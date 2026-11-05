// Google Apps Script Backend for Room Reservation System

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === "getReservations") {
    return jsonResponse(getReservations());
  } else if (action === "getTurnAways") {
    return jsonResponse(getTurnAways());
  }
  
  return jsonResponse({ status: "ok", message: "Google Sheets API Active" });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === "createReservation") {
      return jsonResponse(createReservation(data.payload));
    } else if (action === "updateReservation") {
      return jsonResponse(updateReservation(data.payload));
    } else if (action === "deleteReservation") {
      return jsonResponse(deleteReservation(data.payload.id));
    } else if (action === "logTurnAway") {
      return jsonResponse(logTurnAway(data.payload));
    }
  } catch (error) {
    return jsonResponse({ status: "error", message: error.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getReservations() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reservations");
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  const results = [];
  for (let i = 1; i < values.length; i++) {
    let row = values[i];
    if (!row[0]) continue;
    
    results.push({
      id: String(row[0]),
      week: String(row[1]),
      day: String(row[2]),
      room: String(row[3]),
      slot: String(row[4]),
      barcode: String(row[5]),
      student_name: String(row[6]),
      people: Number(row[7]),
      time_in: String(row[8]),
      time_out: String(row[9]),
      status: String(row[10]),
      notes: String(row[11])
    });
  }
  return results;
}

function getTurnAways() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TurnAways");
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];
  
  return values.slice(1).map(row => ({
    id: row[0],
    week: row[1],
    day: row[2],
    timestamp: row[3]
  }));
}

function createReservation(p) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reservations");
  const id = "res_" + new Date().getTime();
  
  sheet.appendRow([
    id,
    p.week || "this_week",
    p.day,
    p.room,
    p.slot,
    p.barcode || "",
    p.student_name || "",
    p.people || 1,
    p.time_in || "",
    p.time_out || "",
    p.status || "Scheduled",
    p.notes || ""
  ]);
  
  return { status: "success", id: id };
}

function updateReservation(p) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reservations");
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(p.id)) {
      const rowIndex = i + 1;
      
      if (p.barcode !== undefined) sheet.getRange(rowIndex, 6).setValue(p.barcode);
      if (p.student_name !== undefined) sheet.getRange(rowIndex, 7).setValue(p.student_name);
      if (p.people !== undefined) sheet.getRange(rowIndex, 8).setValue(p.people);
      if (p.time_in !== undefined) sheet.getRange(rowIndex, 9).setValue(p.time_in);
      if (p.time_out !== undefined) sheet.getRange(rowIndex, 10).setValue(p.time_out);
      if (p.status !== undefined) sheet.getRange(rowIndex, 11).setValue(p.status);
      if (p.notes !== undefined) sheet.getRange(rowIndex, 12).setValue(p.notes);
      
      return { status: "success", updatedId: p.id };
    }
  }
  return { status: "error", message: "Reservation ID not found" };
}

function deleteReservation(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Reservations");
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { status: "success", deletedId: id };
    }
  }
  return { status: "error", message: "ID not found" };
}

function logTurnAway(p) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TurnAways");
  const id = "ta_" + new Date().getTime();
  
  sheet.appendRow([
    id,
    p.week || "this_week",
    p.day,
    new Date().toISOString()
  ]);
  
  return { status: "success", id: id };
}
