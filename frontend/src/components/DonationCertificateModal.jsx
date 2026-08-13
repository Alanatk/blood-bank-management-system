import React from 'react';
import { X, Download, Printer, Award, ShieldCheck } from 'lucide-react';

const DonationCertificateModal = ({ donation, donorName, onClose }) => {
  if (!donation) return null;

  const certId = `CERT-BB-${String(donation.id).padStart(5, '0')}`;

  // Format date nicely (e.g. 2026-08-12)
  const formattedDate = donation.donation_date
    ? new Date(donation.donation_date).toISOString().split('T')[0]
    : 'N/A';

  const handlePrint = () => {
    window.print();
  };

  // Direct File Download Handler (Downloads HTML/Certificate file directly to device)
  const handleDownload = () => {
    const certHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Certificate - ${certId}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; margin: 0; padding: 40px; display: flex; justify-content: center; }
    .cert-box { background: #ffffff; border: 6px double #e11d48; border-radius: 24px; max-width: 650px; width: 100%; padding: 40px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
    .badge { width: 64px; height: 64px; background: linear-gradient(135deg, #e11d48, #dc2626); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; }
    .sub { color: #e11d48; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
    h1 { font-family: Georgia, serif; font-size: 28px; color: #0f172a; margin: 8px 0; }
    .cert-id { color: #94a3b8; font-size: 12px; font-weight: 700; }
    .name { font-size: 32px; font-weight: 900; color: #be123c; border-bottom: 2px solid #fecdd3; display: inline-block; padding: 0 20px 4px; margin: 12px 0; }
    .details { display: flex; justify-content: space-around; background: #fff1f2; border: 1px solid #ffe4e6; padding: 16px; border-radius: 16px; margin: 24px 0; }
    .detail-item { text-align: center; }
    .detail-label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
    .detail-val { font-size: 16px; font-weight: 900; color: #0f172a; margin-top: 4px; }
    .footer { display: flex; justify-content: space-between; margin-top: 40px; font-size: 12px; color: #64748b; font-weight: 600; }
    .sig { border-top: 1px solid #cbd5e1; padding-top: 4px; font-style: italic; font-weight: 700; color: #1e293b; }
  </style>
</head>
<body>
  <div class="cert-box">
    <div class="badge">🩸</div>
    <div class="sub">Blood Bank Life Saver System</div>
    <h1>CERTIFICATE OF APPRECIATION</h1>
    <div class="cert-id">Certificate ID: ${certId}</div>
    <p style="color:#64748b; font-size:14px; margin-top:20px;">This certificate is proudly awarded to</p>
    <div class="name">${donorName || 'Valued Voluntary Donor'}</div>
    <p style="color:#475569; font-size:13px; line-height:1.6; max-width:500px; margin: 16px auto;">
      In grateful recognition of your noble and voluntary blood donation. Your selfless gift helps preserve human health and save lives in critical medical situations.
    </p>
    <div class="details">
      <div class="detail-item">
        <div class="detail-label">Blood Group</div>
        <div class="detail-val" style="color:#e11d48;">${donation.blood_group}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Units Donated</div>
        <div class="detail-val">${donation.units} Unit(s)</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Donation Date</div>
        <div class="detail-val">${formattedDate}</div>
      </div>
    </div>
    <div class="footer">
      <div>
        <div class="sig">Dr. Medical Officer</div>
        <div>Medical Authority</div>
      </div>
      <div>
        <div class="sig">Blood Bank Director</div>
        <div>Blood Bank System</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Donation_Certificate_${donorName ? donorName.replace(/\s+/g, '_') : 'Donor'}_${certId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      
      {/* Centered Modal Container */}
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fadeIn my-auto max-h-[90vh] flex flex-col border border-slate-200 relative">
        
        {/* Sticky Header Control Bar */}
        <div className="print:hidden px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">Donation Certificate</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Direct File Download Button */}
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-rose-500/20 hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-slate-200 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-xl transition-all focus:outline-none"
              title="Close Certificate Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 relative bg-gradient-to-b from-white via-rose-50/20 to-white print:p-4 print:overflow-visible">
          
          {/* Certificate Inner Double Border Frame */}
          <div className="border-4 border-double border-rose-600/40 p-6 sm:p-8 rounded-2xl relative space-y-5 text-center">
            
            {/* Top Seal Badge */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Award className="w-8 h-8" />
            </div>

            {/* Certificate Header */}
            <div className="space-y-1">
              <span className="text-[11px] font-black tracking-widest text-rose-600 uppercase">
                Blood Bank Life Saver System
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
                CERTIFICATE OF APPRECIATION
              </h2>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
                Certificate ID: {certId}
              </p>
            </div>

            {/* Award Body Text */}
            <div className="space-y-3 py-2">
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">This certificate is proudly awarded to</p>
              <div className="text-2xl sm:text-3xl font-black text-rose-700 border-b-2 border-rose-300 pb-1 max-w-md mx-auto">
                {donorName || 'Valued Voluntary Donor'}
              </div>
              <p className="text-slate-600 text-xs leading-relaxed max-w-lg mx-auto">
                In grateful recognition of your noble and voluntary blood donation. Your selfless gift helps preserve human health and save lives in critical medical situations.
              </p>
            </div>

            {/* Donation Details Badge Grid */}
            <div className="grid grid-cols-3 gap-2 bg-white/90 border border-rose-200/60 p-3.5 rounded-xl max-w-md mx-auto text-xs font-bold shadow-sm">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Blood Group</span>
                <span className="text-rose-600 text-base font-black">{donation.blood_group}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Units Donated</span>
                <span className="text-slate-800 text-xs font-extrabold">{donation.units} Unit(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Donation Date</span>
                <span className="text-slate-800 text-xs font-extrabold">{formattedDate}</span>
              </div>
            </div>

            {/* Footer Signatures */}
            <div className="pt-6 flex justify-between items-end text-[11px] text-slate-500 font-semibold">
              <div className="text-center space-y-1">
                <div className="font-serif italic font-bold text-slate-800 text-xs border-b border-slate-300 pb-0.5">
                  Dr. Medical Officer
                </div>
                <span>Medical Authority</span>
              </div>

              <div className="w-10 h-10 rounded-full border-2 border-dashed border-rose-400 flex items-center justify-center text-rose-500">
                <ShieldCheck className="w-5 h-5" />
              </div>

              <div className="text-center space-y-1">
                <div className="font-serif italic font-bold text-slate-800 text-xs border-b border-slate-300 pb-0.5">
                  Blood Bank Director
                </div>
                <span>Blood Bank System</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DonationCertificateModal;
