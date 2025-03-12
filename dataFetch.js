import { client } from './config.js';
const { jsPDF } = window.jspdf;

document.getElementById('fetchForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const email = formData.get('email');
  const phone = formData.get('phone');

  // Fetch user details from Supabase
  const { data, error } = await client
    .from('userDetails')
    .select('*')
    .eq('email', email)
    .eq('phone', phone)
    .single();

  if (error || !data) {
    alert('No data found or incorrect details');
    return;
  }

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [95, 60] });
  const pageWidth = 95;
  const pageHeight = 60;

  // Green Triangle (Small Triangle in Top Right Corner)
  doc.setFillColor(220,220,220);
  doc.triangle(pageWidth - 12, 0, pageWidth - 45, pageHeight, pageWidth, pageHeight, 'F');
  doc.setFillColor(51, 204, 51);
  doc.triangle(pageWidth, 0, pageWidth - 33, 0, pageWidth, 19, 'F');
  doc.setFillColor(0, 128, 0);
  doc.triangle(pageWidth, 0, pageWidth - 25, 0, pageWidth, 22, 'F');
  doc.setFillColor(0, 128, 0);
  doc.triangle(pageWidth - 33, 0, pageWidth - 40, 0, pageWidth - 18, 11, 'F');


  // Blue Triangle (Larger Diagonal Triangle Below Green)
  
  doc.setFillColor(0, 128, 0);
  doc.triangle(pageWidth, pageHeight, pageWidth , 3, pageWidth - 55, pageHeight, 'F');
  doc.setFillColor(0, 51, 102);
  doc.triangle(pageWidth, pageHeight, pageWidth, 0, pageWidth - 50, pageHeight, 'F');

  // Remaining area is white (by default)

  // GTF Logo
  const logo = new Image();
  logo.src = 'path-to-logo.jpg'; // Replace with actual logo path
  logo.onload = () => {
    doc.addImage(logo, 'JPEG', 5, 5, 20, 15);
  };

  // Profile Picture
  const profile = new Image();
  profile.src = data.profile_url;
  profile.onload = () => {
    doc.setDrawColor(0, 0, 0);
    doc.rect(15, 5, 30, 30);
    doc.addImage(profile, 16, 6, 28, 28);
  };

  // Text Information
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('NAME :', 6, 42);
  doc.text('GTF ID :', 6, 47);
  
  doc.setFont('helvetica', 'normal');
  doc.text(data.fname + ' ' + data.lname, 21, 42);
  doc.text('GTF-' + data.id, 21, 47);

  // Footer Email
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('gtfkwt@gmail.com', 70, 55);

  // Save PDF
  setTimeout(() => {
    doc.save(`${data.fname}-${data.lname}-ID.pdf`);
  }, 500);
});
