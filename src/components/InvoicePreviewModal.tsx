import React, { useState } from 'react';
import { Invoice } from '../types';
import { useData } from '../context/DataContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  X, Printer, Download, Share2, Mail, MessageSquare, Check, Copy, FileText, Smartphone, ShieldCheck
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const InvoicePreviewModal: React.FC<{
  invoice: Invoice | null;
  onClose: () => void;
}> = ({ invoice, onClose }) => {
  const { settings } = useData();
  const [printFormat, setPrintFormat] = useState<'A4' | 'ticket58' | 'ticket80'>('A4');
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!invoice) return null;

  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + (settings.currency || 'Ar');
  };

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  // Download PDF via html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = document.getElementById('invoice-printable-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: printFormat === 'A4' ? 'a4' : [printFormat === 'ticket58' ? 58 : 80, 200]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Facture_${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("Erreur lors de la génération PDF :", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // WhatsApp Share Link
  const handleWhatsAppShare = () => {
    const cleanPhone = invoice.clientPhone.replace(/\s+/g, '').replace(/^0/, '261');
    const text = encodeURIComponent(
      `Bonjour ${invoice.clientName},\n` +
      `Voici votre reçu de paiement Wi-Fi Starlink :\n` +
      `📌 Facture N°: ${invoice.invoiceNumber}\n` +
      `💰 Montant payé: ${formatAriary(invoice.totalPaid)}\n` +
      `📅 Abonnement jusqu'au: ${invoice.endDate}\n` +
      `💳 Mode: ${invoice.paymentMode} (Réf: ${invoice.transactionRef})\n` +
      `Merci de votre confiance !`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // Copy Link/Text
  const handleCopyText = () => {
    const text = `Facture ${invoice.invoiceNumber} - Client: ${invoice.clientName} - Payé: ${formatAriary(invoice.totalPaid)} - Valide jusqu'au ${invoice.endDate}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Controls */}
        <div className="p-4 lg:p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/90 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Facture {invoice.invoiceNumber}
              {invoice.status === 'cancelled' && (
                <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                  ANNULÉE
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">Prévisualisation et impression de reçu professionnel</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Selector */}
            <div className="hidden sm:flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setPrintFormat('A4')}
                className={`px-3 py-1.5 rounded-lg transition-all ${printFormat === 'A4' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Format A4
              </button>
              <button
                onClick={() => setPrintFormat('ticket80')}
                className={`px-3 py-1.5 rounded-lg transition-all ${printFormat === 'ticket80' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Ticket 80mm
              </button>
              <button
                onClick={() => setPrintFormat('ticket58')}
                className={`px-3 py-1.5 rounded-lg transition-all ${printFormat === 'ticket58' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Ticket 58mm
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 flex justify-center">
          
          <div
            id="invoice-printable-content"
            className={`bg-white text-slate-900 font-sans shadow-2xl transition-all ${
              printFormat === 'A4'
                ? 'w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 rounded-lg'
                : printFormat === 'ticket80'
                  ? 'w-[80mm] p-4 text-xs rounded'
                  : 'w-[58mm] p-3 text-[11px] rounded'
            }`}
          >
            {/* Format A4 Design */}
            {printFormat === 'A4' ? (
              <div className="space-y-6">
                
                {/* Header Company Info & Logo */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-indigo-900 uppercase">
                      {settings.name}
                    </h1>
                    <p className="text-xs text-indigo-700 font-semibold italic mt-0.5">
                      {settings.slogan}
                    </p>
                    <div className="text-xs text-slate-600 space-y-0.5 mt-3">
                      <p>📍 {settings.address}, {settings.quartier} - {settings.city}</p>
                      <p>📞 {settings.phone} | ✉️ {settings.email}</p>
                      <p>🌐 {settings.socialMedia}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-block bg-indigo-900 text-white text-sm font-extrabold px-4 py-2 rounded-lg shadow">
                      FACTURE / REÇU
                    </div>
                    <div className="mt-3 text-xs text-slate-700 space-y-1">
                      <p><span className="font-bold">N° Facture :</span> <span className="font-mono text-indigo-900 font-bold">{invoice.invoiceNumber}</span></p>
                      <p><span className="font-bold">Date :</span> {invoice.createdAt.split('T')[0]}</p>
                      <p><span className="font-bold">Heure :</span> {invoice.createdAt.split('T')[1]?.slice(0, 5)}</p>
                      <p><span className="font-bold">Agent :</span> {invoice.agentName}</p>
                    </div>
                  </div>
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">FACTURÉ À</h3>
                    <p className="text-sm font-bold text-slate-900">{invoice.clientName}</p>
                    <p className="text-xs text-slate-600">📞 {invoice.clientPhone}</p>
                    <p className="text-xs text-slate-600">📍 {invoice.clientAddress} ({invoice.clientQuartier})</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">DÉTAILS ABONNEMENT</h3>
                    <p className="text-xs text-slate-700"><span className="font-semibold">Type :</span> Pack {invoice.subscriptionType} Wi-Fi</p>
                    <p className="text-xs text-slate-700"><span className="font-semibold">Durée :</span> {invoice.durationDays} Jours</p>
                    <p className="text-xs text-slate-700"><span className="font-semibold">Période :</span> du {invoice.startDate} au {invoice.endDate}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-indigo-900 text-white font-bold uppercase">
                      <tr>
                        <th className="p-3">Désignation</th>
                        <th className="p-3 text-center">Quantité</th>
                        <th className="p-3 text-right">Prix Unitaire</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {invoice.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-800">{item.designation}</td>
                          <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="p-3 text-right font-mono text-slate-700">{formatAriary(item.unitPrice)}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">{formatAriary(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Breakdown & Payment Mode */}
                <div className="flex justify-between items-start gap-8 pt-2">
                  <div className="space-y-3 flex-1 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
                    <div className="text-xs text-indigo-950 font-bold uppercase tracking-wide">Règlement de la facture</div>
                    <div className="text-xs space-y-1 text-slate-700">
                      <p><span className="font-semibold">Mode de paiement :</span> <span className="font-bold text-indigo-900">{invoice.paymentMode}</span></p>
                      <p><span className="font-semibold">Référence transaction :</span> <span className="font-mono bg-white px-2 py-0.5 rounded border text-indigo-950 font-bold">{invoice.transactionRef}</span></p>
                    </div>
                  </div>

                  <div className="w-64 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Sous-total :</span>
                      <span className="font-mono">{formatAriary(invoice.subtotal)}</span>
                    </div>
                    {invoice.discount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Remise :</span>
                        <span className="font-mono">-{formatAriary(invoice.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-600">
                      <span>Taxes (TVA 0%) :</span>
                      <span className="font-mono">0 Ar</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-indigo-950 pt-2 border-t-2 border-slate-900">
                      <span>TOTAL PAYÉ :</span>
                      <span className="font-mono">{formatAriary(invoice.totalPaid)}</span>
                    </div>
                    {invoice.balanceDue > 0 && (
                      <div className="flex justify-between text-rose-600 font-bold bg-rose-50 p-2 rounded border border-rose-200">
                        <span>Reste à payer :</span>
                        <span className="font-mono">{formatAriary(invoice.balanceDue)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Authenticity Verification (QR Code + Barcode + Signature) */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-6">
                  
                  {/* QR Code */}
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded border border-slate-300 shadow-sm">
                      <QRCodeSVG value={invoice.qrCodePayload} size={80} level="M" />
                    </div>
                    <div className="text-[10px] text-slate-500 space-y-1">
                      <p className="font-bold text-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> FACTURE CERTIFIÉE
                      </p>
                      <p>Scanner pour vérifier l'authenticité</p>
                      <p className="font-mono text-[9px] text-slate-400 break-all max-w-[160px]">{invoice.hashSignature.slice(0, 24)}...</p>
                    </div>
                  </div>

                  {/* Stamp & Signatures */}
                  <div className="text-right space-y-2">
                    <p className="text-xs font-bold text-indigo-900 uppercase">{settings.stampSignatureText}</p>
                    <div className="w-40 h-16 border border-dashed border-indigo-300 rounded-lg flex items-center justify-center bg-indigo-50/30 text-[10px] text-indigo-400 italic">
                      [ Cachet & Signature Numérique ]
                    </div>
                  </div>

                </div>

                {/* Footer Legal Terms */}
                <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 text-center space-y-1">
                  <p>{settings.footerText}</p>
                  <p className="italic">{settings.termsAndConditions}</p>
                </div>

              </div>
            ) : (
              /* Ticket Thermique Format (58mm / 80mm) */
              <div className="space-y-3 text-center font-mono leading-tight">
                <div className="border-b border-dashed border-slate-400 pb-2">
                  <h2 className="font-black text-sm uppercase">{settings.name}</h2>
                  <p className="text-[10px]">{settings.slogan}</p>
                  <p className="text-[9px]">Tél: {settings.phone}</p>
                </div>

                <div className="text-left text-[10px] space-y-1 border-b border-dashed border-slate-400 pb-2">
                  <p><span className="font-bold">Facture:</span> {invoice.invoiceNumber}</p>
                  <p><span className="font-bold">Date:</span> {invoice.createdAt.replace('T', ' ').slice(0, 16)}</p>
                  <p><span className="font-bold">Client:</span> {invoice.clientName}</p>
                  <p><span className="font-bold">Tél:</span> {invoice.clientPhone}</p>
                  <p><span className="font-bold">Abonnement:</span> Pack {invoice.subscriptionType}</p>
                  <p><span className="font-bold">Période:</span> {invoice.startDate} au {invoice.endDate}</p>
                </div>

                <div className="text-left text-[10px] space-y-1 border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between font-bold">
                    <span>Abonnement Wi-Fi</span>
                    <span>{formatAriary(invoice.subtotal)}</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Remise:</span>
                      <span>-{formatAriary(invoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-slate-300">
                    <span>PAYÉ:</span>
                    <span>{formatAriary(invoice.totalPaid)}</span>
                  </div>
                  <p className="text-[9px] pt-1"><span className="font-semibold">Mode:</span> {invoice.paymentMode} ({invoice.transactionRef})</p>
                </div>

                {/* QR Code Thermal */}
                <div className="flex flex-col items-center justify-center pt-1 space-y-1">
                  <QRCodeSVG value={invoice.qrCodePayload} size={65} level="L" />
                  <p className="text-[8px] text-slate-600">Authenticité certifiée ISP</p>
                </div>

                <div className="text-[9px] text-slate-600 pt-2 border-t border-dashed border-slate-400">
                  <p>Merci pour votre confiance !</p>
                  <p>Support: {settings.phone}</p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer Actions (Print, Download PDF, WhatsApp, Email, Copy) */}
        <div className="p-4 lg:p-6 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/25 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-600/25 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
