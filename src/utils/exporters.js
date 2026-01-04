import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (tasks, date) => {
  const doc = new jsPDF();
  let yPos = 10;

  Object.values(tasks).forEach((group, index) => {
    if (group.items.length === 0) return;

    // Add Page for new driver (except first)
    if (index > 0) doc.addPage();
    yPos = 10;

    doc.setFontSize(16);
    doc.text(`Delivery List - ${date}`, 14, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text(`Driver: ${group.boyName}`, 14, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.text(`Summary: Deliver ${group.summary.tiffins} | Collect ${group.summary.emptyBoxes}`, 14, yPos);
    yPos += 10;

    const tableColumn = ["Client", "Phone", "Address", "Deliver", "Add-ons", "Collect"];
    const tableRows = group.items.map(item => [
      item.clientName,
      item.clientPhone,
      item.address,
      item.toDeliver,
      item.hasRice ? `Rice (${item.riceQty})` : '-',
      item.toPickup
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 107, 0] }
    });
  });

  doc.save(`MealRoute_Tasks_${date}.pdf`);
};

export const exportToExcel = (tasks, date) => {
  // Flatten data for Excel
  const flatData = [];

  Object.values(tasks).forEach(group => {
    group.items.forEach(item => {
      flatData.push({
        Date: date,
        Driver: group.boyName,
        Client: item.clientName,
        Phone: item.clientPhone,
        Address: item.address,
        Deliver_Boxes: item.toDeliver,
        Rice: item.hasRice ? item.riceQty : 0,
        Collect_Empty: item.toPickup
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(flatData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tasks");
  XLSX.writeFile(wb, `MealRoute_Tasks_${date}.xlsx`);
};
