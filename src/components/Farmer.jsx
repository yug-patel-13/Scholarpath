// FarmerAdvanced.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { openDB } from "idb";
import Tesseract from "tesseract.js";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import "./Farmer.css";


/*
  FarmerAdvanced - a single-file feature-rich Farmer page.
  Features:
  - Multiple profiles stored in IndexedDB
  - What-if simulator
  - Eligibility engine (extensible rules)
  - Interactive step tracker + document checklist + validator
  - OCR (Tesseract) to extract text from uploaded images and prefill fields
  - Professional PDF generation (jsPDF) with wrapping + dynamic boxes
  - ZIP packet creation (JSZip) with generated PDF + templates placeholder.
  - QR code generation for a shareable token (simulated)
  - Local push notifications (browser Notification API) for reminders
  - Multi-language support (English + Hindi) and TTS for steps
  - Map/link to nearest office (using browser geolocation)
  - Video/audio walkthrough placeholders
  - Comments show where to add server-side features (SMS/WhatsApp, gov APIs)
*/

const DB_NAME = "eligibility-db";
const DB_VERSION = 1;
const PROFILES_STORE = "profiles";

// Simple translations (expand later)
const TRANSLATIONS = {
  en: {
    name: "Name",
    land: "Land Size (acres)",
    crop: "Main Crop",
    income: "Annual Income (Rs.)",
    age: "Age",
    caste: "Caste",
    loan: "Do you have a loan?",
    farmerType: "Farmer Type",
    check: "Check Benefits",
    downloadPDF: "Download PDF Kit",
    downloadZIP: "Download Application ZIP",
    shareQRCode: "Share (QR)",
    simulate: "Simulate Changes",
    enableReminders: "Enable Reminders",
    uploadDoc: "Upload Document / Scan",
    ocrExtract: "Run OCR (Scan)",
    ttsSteps: "Read Steps Aloud",
  }
};

// ---- IndexedDB setup ----
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(PROFILES_STORE)) {
        db.createObjectStore(PROFILES_STORE, { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

// ---- Example scheme dataset (extend in DB/admin later) ----
const DEFAULT_SCHEMES = [
  {
    id: "pmkisan",
    title: "PM Kisan Samman Nidhi (PM-KISAN)",
    link: "https://pmkisan.gov.in/",
    amount: 6000,
    category: "financial",
    states: "all",
    rules: ({ income, land, age }) => income <= 600000 && land <= 2 && age >= 18,
    steps: [
      {
        title: 'Before you start',
        items: [
          'Keep Aadhaar (front/back) photos ready',
          'Keep a cancelled cheque or bank passbook copy ready',
          'Scan or photograph land ownership proof (registry/khatauni)'
        ]
      },
      {
        title: 'Registration',
        items: [
          "Open the PM-KISAN portal and choose 'Beneficiary Registration'",
          'Enter Aadhaar and complete OTP verification',
          'Fill personal details exactly as on Aadhaar'
        ]
      },
      {
        title: 'Bank & Land details',
        items: [
          'Provide bank account details and upload a cancelled cheque',
          'Enter survey/khasra numbers and area for your land parcel',
          'Upload land ownership documents with clear photos'
        ]
      },
      {
        title: 'Submit & follow-up',
        items: [
          'Review uploads and submit application',
          'Save registration/reference number (screenshot or download)',
          'Check beneficiary status after 1-2 weeks and contact CSC if issues'
        ]
      }
    ],
    desc: "Rs. 6,000 per year in 3 equal installments for small/marginal farmers (land ≤ 2 hectares).",
    video: null // placeholder for walkthrough URL
  },
  {
    id: "kcc",
    title: "Kisan Credit Card (KCC)",
    link: "https://www.myscheme.gov.in/schemes/kcc",
    amount: 300000,
    category: "loan",
    states: "all",
    rules: ({ income, loan }) => loan === "no" && income <= 800000,
    steps: [
      {
        title: 'Eligibility & documents',
        items: [
          'Confirm you do not have disqualifying outstanding loans',
          'Collect Aadhaar, land papers, bank statements and income proof'
        ]
      },
      {
        title: 'Apply for KCC',
        items: [
          'Visit participating bank branch or apply via bank portal',
          'Request and fill the KCC application form',
          'Attach required documents and passport photo'
        ]
      },
      {
        title: 'Bank processing',
        items: [
          'Provide estimated credit needs and cash-flow plan',
          'Allow bank verification of land & identity (field visit may occur)',
          'Sign loan agreement once sanctioned and collect sanction letter'
        ]
      },
      {
        title: 'Post-sanction steps',
        items: [
          'Receive KCC card/account and note repayment terms',
          'Use credit for working capital and follow repayment schedule'
        ]
      }
    ],
    desc: "Short-term credit up to Rs. 3 lakh at low interest for eligible farmers.",
    video: null
  },
  {
    id: "pmfbby",
    title: "PM Fasal Bima Yojana (PMFBY)",
    link: "https://pmfby.gov.in/",
    amount: 0,
    category: "insurance",
    states: "all",
    rules: ({ crop, income }) => crop !== "" && income <= 1000000,
    steps: [
      {
        title: 'Pre-registration',
        items: [
          'Check PMFBY season window for your crop',
          'Note required documents: Aadhaar, land proof, area estimates'
        ]
      },
      {
        title: 'Registration',
        items: [
          'Register on PMFBY portal or with local agent',
          'Enter crop type, season and insured area carefully'
        ]
      },
      {
        title: 'Payment & policy',
        items: [
          'Pay premium and save payment receipt',
          'Record policy number and claim timelines'
        ]
      },
      {
        title: 'Claim process',
        items: [
          'If loss occurs, notify insurer/local office within window',
          'Preserve photographic evidence and field diary entries',
          'Submit claim documents and track surveyor inspection'
        ]
      }
    ],
    desc: "Crop insurance protecting against yield losses due to natural calamities.",
    video: null
  },
  {
    id: "soilhealth",
    title: "Soil Health Card Scheme",
    link: "https://soilhealth.dac.gov.in/",
    amount: 0,
    category: "productivity",
    states: "all",
    rules: () => true,
    steps: [
      {
        title: 'Registration & sample kit',
        items: [
          'Register on Soil Health portal or visit extension center',
          'Request sample kit and collection guidance'
        ]
      },
      {
        title: 'Sample collection',
        items: [
          'Collect soil samples from recommended grids across the field',
          'Label each sample with plot/survey number and date'
        ]
      },
      {
        title: 'Submit & track',
        items: [
          'Submit samples to lab and obtain tracking ID',
          'Monitor lab status and wait for analysis results'
        ]
      },
      {
        title: 'Apply recommendations',
        items: [
          'Review Soil Health Card and follow fertilizer recommendations',
          'Consult agricultural officer for dosing and procurement',
          'Re-test every 2-3 years or if crop response changes'
        ]
      }
    ],
    desc: "Free soil testing to improve productivity and fertilizer usage.",
    video: null
  }
];

// Common crop options (20+ items) used in the crop selector
const COMMON_CROPS = [
  'Wheat', 'Rice', 'Maize', 'Pulses', 'Cotton', 'Sugarcane', 'Groundnut', 'Soybean', 'Sunflower', 'Mustard',
  'Sesame', 'Potato', 'Onion', 'Tomato', 'Chili', 'Banana', 'Mango', 'Tea', 'Coffee', 'Tobacco'
];

// ---- Helper: default profile template ----
const emptyProfile = {
  name: "",
  land: "", // acres
  crop: "",
  income: "",
  age: "",
  caste: "",
  loan: "", // "yes"/"no"
  farmerType: "", // small/marginal/large
  state: "", // state selection for locality
  aadhaar: "",
  docs: {}, // uploaded docs metadata
};

// ---- Component ----
export default function FarmerAdvanced({ initialLang = "en" }) {
  const [showOtherCrop, setShowOtherCrop] = useState(false);
  // Single-language (English) helper
  const t = (key) => TRANSLATIONS.en[key] || key;

  // Local DB-backed profiles
  const [_dbReady, setDbReady] = useState(false);
  const dbRef = useRef(null);
  const [profiles, setProfiles] = useState([]); // list of saved profiles
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [profile, setProfile] = useState({ ...emptyProfile });
  const [schemes, _setSchemes] = useState(DEFAULT_SCHEMES);
  const [eligible, setEligible] = useState([]);
  const [totalBenefit, setTotalBenefit] = useState(0);
  const [simulate, setSimulate] = useState({ ...emptyProfile });
  const [ocrStatus, setOcrStatus] = useState({ busy: false, text: "" });
  const [qrToken, setQrToken] = useState("");
  const [qrData, setQrData] = useState(""); // full packet encoded for QR
  const [qrImage, setQrImage] = useState(""); // dataURL captured from QR canvas
  const [notificationSupported, setNotificationSupported] = useState(false);
  const [_reminderEnabled, setReminderEnabled] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // Step tracker state per scheme (in-memory). For persistence, attach to profile.docs or separate store.
  const [progressState, setProgressState] = useState({}); // { schemeId: [bool,...] }
  const [stepsOpen, setStepsOpen] = useState({}); // { schemeId: boolean }

  // DB init
  useEffect(() => {
    (async () => {
      dbRef.current = await getDB();
      setDbReady(true);
      // load stored profiles
      const all = await dbRef.current.getAll(PROFILES_STORE);
      setProfiles(all || []);
      if (all && all.length) {
        setActiveProfileId(all[0].id);
        setProfile(all[0]);
      }
    })();
    setNotificationSupported("Notification" in window);
  }, []);

  // (removed global form checklist - replaced by per-scheme required documents)

  // helper to check if a given doc is explicitly confirmed by the user (availability depends on explicit confirmation)
  const hasDocument = (docName) => {
    if (profile && profile.docs && profile.docs.confirmed && profile.docs.confirmed[docName]) return true;
    return false;
  };

  // helper to check if an uploaded doc exists (without requiring user confirmation)
  const hasUploadedDoc = (docName) => {
    if (profile && profile.docs) {
      return Object.values(profile.docs).some(d => {
        if (!d) return false;
        const lower = (d.type || d.name || '').toString().toLowerCase();
        return lower.includes(docName);
      });
    }
    return false;
  };

  // Toggle user confirmation for a semantic docName; persist to profile.docs.confirmed
  const toggleConfirmDoc = async (docName) => {
    const p = { ...profile };
    p.docs = p.docs || {};
    p.docs.confirmed = { ...(p.docs.confirmed || {}) };
    p.docs.confirmed[docName] = !p.docs.confirmed[docName];
    setProfile(p);
    try { await saveProfileToDB(p); } catch (err) { console.warn('Failed to save confirmation', err); }
  };

  // Utility: save profile to indexedDB
  const saveProfileToDB = async (p) => {
    if (!dbRef.current) return;
    const db = dbRef.current;
    if (p.id) {
      await db.put(PROFILES_STORE, p);
    } else {
      const id = await db.add(PROFILES_STORE, p);
      p.id = id;
    }
    const all = await db.getAll(PROFILES_STORE);
    setProfiles(all);
    setActiveProfileId(p.id);
    setLastSavedAt(new Date().toLocaleString());
  };

  // Create new profile
  const createNewProfile = async () => {
    const newP = { ...emptyProfile, name: `Profile ${profiles.length + 1}` };
    await saveProfileToDB(newP);
    setProfile(newP);
  };

  // Load profile by id
  const loadProfile = async (id) => {
    const p = await dbRef.current.get(PROFILES_STORE, id);
    if (p) {
      setProfile(p);
      setActiveProfileId(p.id);
    }
  };

  // Delete profile
  const deleteProfile = async (id) => {
    if (!dbRef.current) return;
    await dbRef.current.delete(PROFILES_STORE, id);
    const all = await dbRef.current.getAll(PROFILES_STORE);
    setProfiles(all);
    if (all[0]) {
      setProfile(all[0]);
      setActiveProfileId(all[0].id);
    } else {
      setProfile({ ...emptyProfile });
      setActiveProfileId(null);
    }
  };

  // Update local profile state (form)
  const updateProfileField = (key, value) => {
    setProfile((p) => {
      const next = { ...p, [key]: value };
      return next;
    });
  };

  // Run eligibility check
  const runEligibility = useCallback((p) => {
    // cast numbers
    const env = {
      income: Number(p.income || 0),
      land: Number(p.land || 0),
      age: Number(p.age || 0),
      loan: p.loan,
      crop: p.crop,
      caste: p.caste,
      state: p.state || "all",
    };

    const eligibleNow = schemes.filter((s) => {
      try {
        // state checks: allow scheme if s.states === 'all' or includes state's name
        const stateOk = s.states === "all" || s.states === env.state;
        return stateOk && s.rules(env);
      } catch (err) {
        console.error("Rule error for scheme", s.id, err);
        return false;
      }
    });

    // benefit sum
    const total = eligibleNow.reduce((sum, s) => sum + (s.amount || 0), 0);
    setEligible(eligibleNow);
    setTotalBenefit(total);
    return { eligibleNow, total };
  }, [schemes]);

  // Save profile (manual save)
  const handleSaveProfile = async () => {
    await saveProfileToDB(profile);
  };

  // Persist progressState into profile.docs and save to DB whenever progressState changes
  useEffect(() => {
    // merge into profile.docs
    const updated = { ...profile, docs: { ...(profile.docs || {}), progressState } };
    setProfile(updated);
    // auto-save if profile has been assigned an id or even if not (saveProfileToDB handles add)
    (async () => {
      try {
        await saveProfileToDB(updated);
      } catch (err) {
        console.warn('Failed to auto-save progressState', err);
      }
    })();
  }, [progressState]);

  

  // On profile change auto-run simulation
  useEffect(() => {
    if (profile && (profile.income || profile.land || profile.age)) {
      runEligibility(profile);
    }
  }, [profile, runEligibility]);

  // --- OCR function (client-side) ---
  const _handleImageOCR = async (file) => {
    if (!file) return;
    setOcrStatus({ busy: true, text: "" });
    try {
      const { data } = await Tesseract.recognize(file, "eng", { logger: m => {/* optional logs */} });
      const text = data.text || "";
      setOcrStatus({ busy: false, text });
      // Try to parse Aadhaar-like number (4-4-4) or 12-digit
      const aadhaarMatch = text.match(/\d{4}\s?\d{4}\s?\d{4}|\d{12}/);
      const number = aadhaarMatch ? aadhaarMatch[0].replace(/\s/g, "") : null;
      // rough extraction of name (first line)
      const candidateName = text.split("\n").find(l => l.trim().length > 3);
      // fill profile fields if empty
      setProfile(p => ({
        ...p,
        name: p.name || candidateName || p.name,
        // store raw OCR text under docs for user's inspection
        docs: { ...(p.docs||{}), lastOCR: text, aadhaar: number || (p.docs && p.docs.aadhaar) }
      }));
    } catch (err) {
      console.error("OCR error", err);
      setOcrStatus({ busy: false, text: "" });
      alert("OCR failed. Try a clearer image.");
    }
  };

  // New: handle document upload with OCR for Aadhaar extraction
  const handleDocUpload = async (file, docType = 'other') => {
    if (!file) return;
    // store metadata
  const p = { ...profile };
  p.docs = p.docs || {};
  const key = `aadhaar_${Date.now()}`;
  p.docs[key] = { name: file.name, size: file.size, type: docType };

    // If image, try OCR for Aadhaar-like numbers
    if (file.type.startsWith('image/')) {
      setOcrStatus({ busy: true, text: '' });
      try {
        const { data } = await Tesseract.recognize(file, 'eng', { logger: m => {/* optional logs */} });
        const text = data.text || '';
        // improved Aadhaar regex: allow spaces, dashes, dots or none, capture 12 digits or 4-4-4
        const aadhaarMatch = text.match(/\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b|\b\d{12}\b/);
        const number = aadhaarMatch ? aadhaarMatch[0].replace(/[^0-9]/g, '') : null;
        setOcrStatus({ busy: false, text, lastAadhaar: number });

        // if found, set profile.aadhaar synchronously
        if (number) {
          p.aadhaar = number;
        }
        // Auto-confirm Aadhaar when user uploads an Aadhaar image/file
        if (docType === 'aadhaar') {
          p.docs.confirmed = { ...(p.docs.confirmed || {}) };
          p.docs.confirmed['aadhaar'] = true;
        }
        // store raw OCR under docs
        p.docs[key].ocr = text;
        setProfile(p);
        // auto-save
        await saveProfileToDB(p);
        alert(number ? `OCR found Aadhaar: ${number}` : 'OCR completed, no Aadhaar-like number found.');
      } catch (err) {
        console.error('Document OCR error', err);
        setOcrStatus({ busy: false, text: '' });
        alert('OCR failed. Try a clearer image.');
      }
    } else if (file.type === 'application/pdf') {
      // For PDFs, we can't OCR in-browser easily. Save metadata and inform user.
      // Auto-confirm Aadhaar if the uploaded PDF was for Aadhaar
      if (docType === 'aadhaar') {
        p.docs.confirmed = { ...(p.docs.confirmed || {}) };
        p.docs.confirmed['aadhaar'] = true;
      }
      await saveProfileToDB(p);
      alert('PDF uploaded. OCR for PDFs is not supported in-browser in this demo.');
    } else {
      await saveProfileToDB(p);
    }
  };

  // helper: return required doc keys for a scheme (same mapping as validateDocsForScheme)
  const getRequiredDocsForScheme = (scheme) => {
    const perCategory = {
      financial: ['aadhaar', 'bank'],
      loan: ['aadhaar', 'bank', 'land'],
      insurance: ['aadhaar', 'land'],
      productivity: ['aadhaar', 'land']
    };
    return perCategory[scheme.category] || ['aadhaar', 'land'];
  };

  // --- PDF generation (jsPDF) - professional layout with wrapping and dynamic boxes ---
  const generatePDFBytes = (eligibleList = eligible) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    let y = 48;

    // Header
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, pageWidth, 56, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Farmer Benefits Report', margin, 36);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 36, { align: 'right' });

    y += 10;

    // Farmer info area (single column). Reserve space for QR on the right to avoid overlap.
    const left = margin;
    const qrSize = qrImage ? 92 : 0;
    const qrReserved = qrSize ? (qrSize + 12) : 0;
    let usableW = pageWidth - margin * 2 - qrReserved;

    // helper to ensure there is space, otherwise add new page and reset y
    const ensureSpace = (needed) => {
      if (y + needed > pageHeight - margin) {
        doc.addPage();
        y = margin + 10;
      }
    };

    // helpers removed (kept inline code paths for clarity)

    // Prepare info rows and compute dynamic box height
    const infoRows = [
      ['Name', profile.name || '-'],
      ['Age', profile.age || '-'],
      ['Land (acres)', profile.land || '-'],
      ['Caste', profile.caste || '-'],
      ['Main Crop', profile.crop || '-'],
      ['Loan Status', profile.loan || '-'],
      ['Annual Income (Rs.)', profile.income || '-'],
      ['Farmer Type', profile.farmerType || '-'],
    ];

    const rowHeight = 16;
    const paddingInfo = 12;
    // compute height conservatively
    const infoH = infoRows.length * rowHeight + paddingInfo * 2;
    ensureSpace(infoH + 20);

    const infoStartY = y + 6;
    doc.setDrawColor(200, 210, 220);
    doc.setFillColor(250, 252, 255);
    doc.rect(left, infoStartY - 6, usableW, infoH, 'FD');
    doc.setTextColor(10, 20, 30);
    doc.setFontSize(12);
    let ry = infoStartY + paddingInfo;

    doc.setFont('helvetica', 'bold');
    infoRows.forEach(([label, val]) => {
      doc.text(`${label}:`, left + 12, ry);
      doc.setFont('helvetica', 'normal');
      const valStr = String(val || '-');
      const valLines = doc.splitTextToSize(valStr, usableW - 160);
      // draw first line at same ry, additional lines below
      doc.text(valLines[0], left + 150, ry);
      for (let i = 1; i < valLines.length; i++) {
        ry += 12;
        doc.text(valLines[i], left + 150, ry);
      }
      ry += rowHeight;
      doc.setFont('helvetica', 'bold');
    });

    y = infoStartY + infoH + 12;

    // Add QR image to the right of the info box (if available), and print share URL beneath it
    if (qrImage) {
      try {
        const qrX = pageWidth - margin - qrSize;
        const qrY = infoStartY + 8;
        doc.addImage(qrImage, 'PNG', qrX, qrY, qrSize, qrSize);
        if (qrData && typeof qrData === 'string' && qrData.startsWith('http')) {
          doc.setFontSize(9);
          doc.setTextColor(6, 120, 180);
          const shortY = qrY + qrSize + 6;
          const maxUrlW = qrSize + 4;
          const urlLines = doc.splitTextToSize(qrData, maxUrlW);
          urlLines.forEach((ln, i) => {
            doc.text(ln, qrX, shortY + i * 10);
          });
          doc.setFontSize(12);
          doc.setTextColor(10, 20, 30);
        }
      } catch (err) {
        console.warn('Could not add QR image to PDF', err);
      }
    }

  // Eligible schemes header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(33, 150, 243);
    doc.text('Eligible Schemes', left, y);
  // small included count (helpful to verify how many were rendered)
  const includedCount = (eligibleList || []).length;
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Included ${includedCount} scheme${includedCount !== 1 ? 's' : ''}`, left + usableW - 6, y, { align: 'right' });
    y += 18;
    doc.setDrawColor(220, 220, 220);
    doc.line(left, y - 6, left + usableW, y - 6);

  // Schemes list
    eligibleList.forEach((s, idx) => {
      // ensure each scheme starts on a fresh page to avoid accidental clipping/omission
      if (idx > 0) {
        doc.addPage();
        y = margin + 10;
      }
      // debug: log which schemes are processed
      try { console.log('PDF: including scheme', idx, s.id || s.title); } catch (e) {}
      // prepare text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(6, 78, 124);

      const title = `${idx + 1}. ${s.title}`;
      const amountText = s.amount && s.amount > 0 ? `Rs. ${s.amount}` : 'Varies';

      // title and amount
      const titleLines = doc.splitTextToSize(title, usableW - 100);
      const descLines = doc.splitTextToSize(s.desc.replace(/₹/g, 'Rs.'), usableW - 12);

      // Build step blocks from grouped steps (each group has title and items)
      const stepBlocks = [];
      (s.steps || []).forEach(group => {
        // group title
        const titleLines = doc.splitTextToSize(group.title || '', usableW - 28);
        stepBlocks.push({ type: 'title', lines: titleLines });
        // items under group (bulleted)
        (group.items || []).forEach(item => {
          // indent bullets slightly
          const itemLines = doc.splitTextToSize('• ' + item, usableW - 48);
          stepBlocks.push({ type: 'item', lines: itemLines });
        });
        // small separator after each group
        stepBlocks.push({ type: 'spacer', lines: [''] });
      });

      // estimate block height conservatively
      const estimateH = titleLines.length * 14 + 6 + descLines.length * 12 + stepBlocks.reduce((sum, blk) => sum + (blk.lines.length * 12 + (blk.type === 'title' ? 8 : 4)), 0) + 22 + 18;

      // If remaining space too small to fit this scheme, start a new page to avoid partial clipping
      const minNeeded = Math.min(estimateH + 20, pageHeight - margin - 40);
      if (y + minNeeded > pageHeight - margin) {
        doc.addPage();
        y = margin + 10;
      }

      titleLines.forEach((ln, i) => {
        doc.text(ln, left + 6, y + i * 14);
      });
      doc.text(amountText, left + usableW - 10, y, { align: 'right' });
      y += titleLines.length * 14 + 6;

      // description (truncate if it's too large for the remaining space)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 50, 60);
      const remainingSpace = pageHeight - margin - y;
  let usedDescLines = descLines.slice();

      // If estimated content too big, shrink description first
      if (estimateH > remainingSpace) {
        // allow at most remainingSpace - 80 for description
        const allowed = Math.max(0, Math.floor((remainingSpace - 80) / 12));
        if (usedDescLines.length > allowed) {
          usedDescLines = usedDescLines.slice(0, allowed);
          if (usedDescLines.length) {
            const last = usedDescLines[usedDescLines.length - 1];
            usedDescLines[usedDescLines.length - 1] = last.replace(/\s+\S+$/, '...');
          }
        }
      }

      usedDescLines.forEach(line => {
        doc.text(line, left + 8, y);
        y += 12;
      });

      // steps - render group titles and bulleted items, with page-break safety
      doc.setFontSize(10);
      for (let si = 0; si < stepBlocks.length; si++) {
        const blk = stepBlocks[si];
        const blkLineCount = blk.lines.length;
        const blkH = blkLineCount * 12 + (blk.type === 'title' ? 8 : 4);
        if (y + blkH > pageHeight - margin) {
          doc.addPage();
          y = margin + 10;
        }

        if (blk.type === 'title') {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          blk.lines.forEach((ln, li) => { doc.text(ln, left + 8, y); y += 14; });
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
        } else if (blk.type === 'item') {
          // render first line with bullet aligned
          for (let li = 0; li < blk.lines.length; li++) {
            const ln = blk.lines[li];
            if (li === 0) {
              doc.text(ln.replace(/^•\s*/, ''), left + 28, y);
              doc.text('•', left + 12, y);
            } else {
              // subsequent wrapped lines indent
              doc.text(ln, left + 28, y);
            }
            y += 12;
          }
          y += 4;
        } else {
          // spacer
          y += 6;
        }
      }

      // official link
      if (y + 24 > pageHeight - margin) { doc.addPage(); y = margin; }
      doc.setTextColor(6, 120, 180);
      doc.textWithLink(`Official Link: ${s.link}`, left + 8, y, { url: s.link });
      y += 18;

      // separator
      doc.setDrawColor(230, 230, 230);
      doc.line(left + 2, y, left + usableW - 2, y);
      y += 10;
    });

    // Summary / total
    if (y + 40 > pageHeight - margin) { doc.addPage(); y = margin; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(10, 20, 30);
    doc.text(`Total Estimated Benefit: Rs. ${totalBenefit}`, left + 6, y + 8);

    // Page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
    }

    return doc.output('arraybuffer');
  };

  // Download PDF (save file)
  const handleDownloadPDF = () => {
    try {
      const bytes = generatePDFBytes(eligible);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Farmer_Report_${(profile.name || "profile").replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Failed to generate PDF.");
    }
  };

  // Create ZIP application packet (PDF + templates placeholders)
  const handleDownloadZIP = async () => {
    const zip = new JSZip();
    // Add generated PDF bytes
    const pdfBytes = generatePDFBytes(eligible);
    zip.file(`Farmer_Report_${(profile.name || "profile")}.pdf`, pdfBytes);

    // Add placeholder templates and readme
    zip.file("README.txt", `Application packet for ${profile.name}\nFollow steps inside each scheme folder to submit on the portal.\n`);
    // You can add real templates (blank PDF forms) via admin upload in the future
    schemes.forEach(s => {
      const folder = zip.folder(s.id);
  // flatten grouped steps into text
  const flatStepsText = (s.steps || []).map(g => (g.title ? g.title + ':' : '') + '\n' + (g.items || []).map(it => '- ' + it).join('\n')).join('\n\n');
  folder.file(`${s.id}_instructions.txt`, `Apply here: ${s.link}\nSteps:\n${flatStepsText}\n`);
      // placeholder for blank template
      folder.file(`${s.id}_blank_form_placeholder.txt`, "Upload your scanned form here (Admin to provide blank PDF later).");
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Application_Packet_${(profile.name || "profile")}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate a share token (simulated) and store packet in localStorage
  const handleGenerateShareToken = async () => {
    // Create a full share packet (we'll encode it into the QR so scanners can read data directly)
    const token = `pkt_${Math.random().toString(36).slice(2, 9)}`;
    const packet = {
      id: token,
      profile,
      eligible,
      totalBenefit,
      generatedAt: new Date().toISOString()
    };
    // store locally as a backup (simulating server-side storage)
    localStorage.setItem(token, JSON.stringify(packet));
  // create a shareable short URL (so scanners like Google can open it directly)
  const origin = window.location.origin || `${window.location.protocol}//${window.location.host}`;
  const shareUrl = `${origin}/share/${token}`;
  setQrData(shareUrl);
    setQrToken(token);
    // small delay to allow hidden QR canvas to render, then capture its dataURL
    setTimeout(() => {
      try {
        const canvas = document.querySelector('#pdf-qr-canvas');
        if (canvas && canvas.toDataURL) {
          const dataUrl = canvas.toDataURL('image/png');
          setQrImage(dataUrl);
        }
      } catch (err) {
        console.warn('Could not capture QR image', err);
      }
    }, 120);
    alert("Share token generated. QR now encodes the full packet (base64). Scan with a QR scanner that shows raw text or paste into the app to view.");
  };

  // Read shared token (simulate viewer)
  const _handleReadSharedToken = (token) => {
    const raw = localStorage.getItem(token);
    if (!raw) return alert("Token not found (this is a demo - token is stored locally).");
    const packet = JSON.parse(raw);
    console.log("Shared packet:", packet);
    alert(`Shared packet for ${packet.profile.name}\nEligible: ${packet.eligible.length} schemes`);
  };

  // Request notification permission & schedule a local reminder using setTimeout (demo)
  const enableReminders = async () => {
    if (!("Notification" in window)) return alert("Notifications not supported in your browser.");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission denied.");
      return;
    }
    setReminderEnabled(true);
    // Example: schedule a simple reminder in 10 seconds for demo (in prod schedule via server/scheduler)
    setTimeout(() => {
      new Notification("Reminder: Check your scheme deadlines", {
        body: `You have ${eligible.length} eligible schemes. Open app to continue.`,
      });
    }, 10000);
    alert("Local demo reminder scheduled in 10 seconds. (For real reminders, integrate server SMS/WhatsApp).");
  };

  // Map link to nearest office (use geolocation)
  const handleFindNearestOffice = async () => {
    if (!("geolocation" in navigator)) {
      return alert("Geolocation not available.");
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      // In prod, call reverse geocode to find district & match nearest office from DB
      const gmaps = `https://www.google.com/maps/search/government+agriculture+office/@${latitude},${longitude},12z`;
      window.open(gmaps, "_blank");
    }, (err) => {
      console.error(err);
      alert("Could not get location. Allow location or pick state manually.");
    });
  };

  // Text-to-speech for steps (English only)
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return alert("TTS not supported.");
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    speechSynthesis.speak(utt);
  };

  // Stop any ongoing speech
  const stopSpeak = () => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Stop speech failed', err);
    }
  };

  // Quick doc validator: check required docs presence by simple keys (Aadhaar, bank, landProof)
  const validateDocsForScheme = (scheme) => {
    // define required docs per category (simple mapping)
    const perCategory = {
      financial: ['aadhaar', 'bank'],
      loan: ['aadhaar', 'bank', 'land'],
      insurance: ['aadhaar', 'land'],
      productivity: ['aadhaar', 'land']
    };
    const required = perCategory[scheme.category] || ['aadhaar', 'land'];
    const missing = required.filter(r => !hasDocument(r));
    return { ok: missing.length === 0, missing };
  };

  // Handle small form submit (check eligibility and save profile)
  const handleCheckAndSave = async (e) => {
    e && e.preventDefault();
    // basic validation
    if (!profile.name) return alert("Please enter name");
    if (!profile.aadhaar) return alert("Aadhaar is required. Please upload Aadhaar and run OCR or enter Aadhaar number manually.");
    // run eligibility
    runEligibility(profile);
    // save
    await saveProfileToDB(profile);
    alert("Profile saved and eligibility checked.");
  };

  // (single-language) language toggle removed

  // init default simulate state
  useEffect(() => {
    setSimulate(profile);
  }, [profile]);

  // ---- rendering ----
  return (
    <div className="farmer-page" style={{ padding: 20, fontFamily: "Inter, Arial, sans-serif", maxWidth: 1100, margin: "0 auto" }}>
      <div className="header-row">
        <div className="site-brand" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="brand-logo" aria-hidden>
            {/* simple SVG mark */}
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="6" fill="#0ea5d7" />
              <path d="M7 13c1.5-2 3-3 5-3s3.5 1 5 3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="9" r="1.1" fill="#fff" />
            </svg>
          </div>
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>Eligibility Genie</h1>
            <div style={{ fontSize: 12, color: '#285569' }}>Farmer — Advanced</div>
          </div>
        </div>

        <div className="header-actions">
          <div style={{ fontSize: 13, color: '#285569', padding: '6px 10px' }}>English</div>
          <button className="btn" onClick={() => createNewProfile()} style={{ marginLeft: 8 }}>+ New Profile</button>
        </div>
      </div>

      {/* Profiles list */}
      <div className="profiles-row" style={{ display: "flex", gap: 12, marginTop: 12, marginBottom: 12, alignItems: "center" }}>
        <select value={activeProfileId || ""} onChange={(e) => loadProfile(Number(e.target.value))}>
          <option value="">-- Select Profile --</option>
          {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="btn secondary" onClick={() => { if (activeProfileId) deleteProfile(activeProfileId); }}>Delete Profile</button>
        <span className="debug" style={{ color: "#666" }}>{lastSavedAt ? `Last saved: ${lastSavedAt}` : ""}</span>
      </div>

      {/* Profile form */}
  <form onSubmit={handleCheckAndSave} className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label>{t("name")}</label>
          <input value={profile.name} onChange={(e) => updateProfileField("name", e.target.value)} />
        </div>
        <div>
          <label>{t("land")}</label>
          <input type="number" value={profile.land} onChange={(e) => updateProfileField("land", e.target.value)} />
        </div>
        <div>
          <label>{t("crop")}</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={COMMON_CROPS.includes(profile.crop) ? profile.crop : (profile.crop ? 'Other' : '')} onChange={(e) => {
              const v = e.target.value;
              if (v === 'Other') {
                setShowOtherCrop(true);
                updateProfileField('crop', '');
              } else {
                setShowOtherCrop(false);
                updateProfileField('crop', v);
              }
            }}>
              <option value="">-- Select crop --</option>
              {COMMON_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="Other">Other</option>
            </select>
            {showOtherCrop && (
              <input placeholder="Type other crop" value={!COMMON_CROPS.includes(profile.crop) ? profile.crop : ''} onChange={(e) => updateProfileField('crop', e.target.value)} />
            )}
          </div>
        </div>
        <div>
          <label>{t("income")}</label>
          <input type="number" value={profile.income} onChange={(e) => updateProfileField("income", e.target.value)} />
        </div>
        <div>
          <label>{t("age")}</label>
          <input type="number" value={profile.age} onChange={(e) => updateProfileField("age", e.target.value)} />
        </div>
        <div>
          <label>{t("caste")}</label>
          <select value={profile.caste} onChange={(e) => updateProfileField("caste", e.target.value)}>
            <option value="">Select</option>
            <option value="general">General</option>
            <option value="sc">SC</option>
            <option value="st">ST</option>
            <option value="obc">OBC</option>
          </select>
        </div>
        <div>
          <label>{t("loan")}</label>
          <select value={profile.loan} onChange={(e) => updateProfileField("loan", e.target.value)}>
            <option value="">Select</option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        <div>
          <label>{t("farmerType")}</label>
          <select value={profile.farmerType} onChange={(e) => updateProfileField("farmerType", e.target.value)}>
            <option value="">Select</option>
            <option value="marginal">Marginal ≤ 1 ha</option>
            <option value="small">Small ≤ 2 ha</option>
            <option value="large">Largerthen 2 ha</option>
          </select>
        </div>
        <div>
          <label>State</label>
          <input value={profile.state || ""} onChange={(e) => updateProfileField("state", e.target.value)} placeholder="e.g., Gujarat" />
        </div>

        {/* Document upload + OCR */}
        <div className="wide-row" style={{ gridColumn: "1 / -1", marginTop: 8 }}>
          <label>Upload Aadhaar (image preferred)</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: 'wrap' }}>
            <input id="docFileInput" type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              await handleDocUpload(file, 'aadhaar');
            }} />
            <button className="btn secondary" type="button" onClick={() => {
              // view last OCR result
              alert(`OCR Text Preview:\n\n${ocrStatus.text || "No OCR run yet."}`);
            }}>{t("ocrExtract")}</button>
            <button className="btn" type="button" onClick={() => handleFindNearestOffice()}>Find nearest office</button>
            <button className="btn" type="button" onClick={() => handleDownloadZIP()}>{t("downloadZIP")}</button>
            <button className="btn" type="button" onClick={() => handleGenerateShareToken()}>{t("shareQRCode")}</button>
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ minWidth: 120 }}>Aadhaar Number</label>
            <input id="aadhaarInput" value={profile.aadhaar || ''} onChange={(e) => updateProfileField('aadhaar', e.target.value)} placeholder="XXXX XXXX XXXX" />
            <button className="btn ghost" type="button" onClick={() => { updateProfileField('aadhaar', ''); setOcrStatus(s => ({ ...(s||{}), lastAadhaar: null })); }}>Clear</button>
            <div style={{ color: '#666', fontSize: 12 }}>
              {ocrStatus.busy ? 'OCR running...' : (ocrStatus.lastAadhaar ? `OCR found: ${ocrStatus.lastAadhaar}` : '')}
            </div>
          </div>
        </div>

        {/* Save/Check */}
        <div className="actions-row" style={{ gridColumn: "1 / -1", display: "flex", gap: 8, marginTop: 8 }}>
          <button className="btn" type="submit">{t("check")}</button>
          <button className="btn secondary" type="button" onClick={() => handleSaveProfile()} >Save Profile</button>
          <button className="btn" type="button" onClick={() => handleDownloadPDF()}>{t("downloadPDF")}</button>
          <button className="btn secondary" type="button" onClick={() => enableReminders()} disabled={!notificationSupported}>{t("enableReminders")}</button>
        </div>
      </form>

      {/* What-if simulator */}
      <section className="simulator" style={{ marginTop: 18, padding: 12, border: "1px dashed #ddd", borderRadius: 8 }}>
        <h3>{t("simulate")}</h3>
        <div className="sim-row" style={{ display: "flex", gap: 10 }}>
          <div>
            <label>Land (acres)</label>
            <input type="range" min="0" max="20" value={simulate.land || profile.land || 0}
              onChange={(e) => setSimulate(s => ({ ...s, land: Number(e.target.value) }))} />
            <div>{simulate.land || profile.land || 0} acres</div>
          </div>
          <div>
            <label>Income (Rs.)</label>
            <input type="range" min="0" max="2000000" step="10000" value={simulate.income || profile.income || 0}
              onChange={(e) => setSimulate(s => ({ ...s, income: Number(e.target.value) }))} />
            <div>Rs. {simulate.income || profile.income || 0}</div>
          </div>
          <div style={{ alignSelf: "end" }}>
            <button onClick={() => {
              // run quick simulate check
              const { eligibleNow, total } = runEligibility(simulate);
              alert(`Simulate result: ${eligibleNow.length} schemes, Est benefit: Rs. ${total}`);
            }}>Run Simulation</button>
          </div>
        </div>
      </section>

      {/* Required Documents summary (aggregated for eligible schemes) */}
      <section className="required-docs" style={{ marginTop: 18 }}>
        <h3>Required Documents for Eligible Schemes</h3>
        <div style={{ padding: 12, border: '1px solid #eef6ff', borderRadius: 8, background: '#fff' }}>
          {eligible.length === 0 ? (
            <div style={{ color: '#666' }}>No eligible schemes. Fill the form and click Check Benefits.</div>
          ) : (
            (() => {
              // compute aggregate required docs
              const reqSet = new Set();
              eligible.forEach(s => getRequiredDocsForScheme(s).forEach(d => reqSet.add(d)));
              const reqList = Array.from(reqSet);
              return (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  {reqList.map(dk => {
                    const uploaded = hasUploadedDoc(dk);
                    const confirmed = profile && profile.docs && profile.docs.confirmed && profile.docs.confirmed[dk];
                    const label = dk === 'aadhaar' ? 'Aadhaar' : dk === 'bank' ? 'Bank passbook / cancelled cheque' : 'Land proof';
                    const status = confirmed ? 'Confirmed' : (uploaded ? 'Uploaded' : 'Missing');
                    return (
                      <div key={dk} style={{ minWidth: 220 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <div style={{ fontWeight: 700 }}>{label}</div>
                          <div className={status === 'Confirmed' ? 'doc-pill ok' : (status === 'Uploaded' ? 'doc-pill ok' : 'doc-pill missing')} style={{ marginLeft: 8 }}>{status}</div>
                        </div>
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                          {dk !== 'bank' && !uploaded && (
                            <input type="file" accept={dk === 'aadhaar' ? 'image/*' : '.pdf,image/*'} onChange={async (e) => {
                              const f = e.target.files && e.target.files[0];
                              if (!f) return;
                              await handleDocUpload(f, dk);
                            }} />
                          )}
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="checkbox" checked={!!confirmed} onChange={() => toggleConfirmDoc(dk)} />
                            <span style={{ fontSize: 12 }}>I have this document</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      </section>

      {/* Eligible schemes list */}
      <section className="eligible-list" style={{ marginTop: 18 }}>
        <h2>Eligible Schemes ({eligible.length})</h2>
  <div className="scheme-grid">
          {eligible.length === 0 && <div style={{ color: "#666" }}>No schemes match your profile yet.</div>}
          {eligible.map(s => (
            <div key={s.id} className="scheme-card">
                <div className="scheme-header">
                  <h3 className="scheme-title">{s.title}</h3>
                  <div style={{ textAlign: 'right' }}>
                    <div className="scheme-amount">{s.amount && s.amount > 0 ? `Rs. ${s.amount}` : "Varies"}</div>
                  </div>
                </div>

                <div className="scheme-desc-block">
                  <p className="scheme-desc">{s.desc}</p>
                  <a className="scheme-link" href={s.link} target="_blank" rel="noreferrer">{s.link}</a>
                </div>

                <div className="scheme-steps">
                  {stepsOpen[s.id] && (
                    <div id={`scheme-${s.id}`} style={{ marginTop: 8 }}>
                      <StepTrackerInner scheme={s} progressState={progressState} setProgressState={(next) => setProgressState(next)} />
                    </div>
                  )}
                </div>

                <div className="scheme-actions-row" style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div className="doc-check">
                    <strong>Document checklist:</strong>
                    <div style={{ marginLeft: 8 }} className={validateDocsForScheme(s).ok ? "doc-pill ok" : "doc-pill missing"}>
                      {validateDocsForScheme(s).ok ? "All core docs present" : `Missing: ${validateDocsForScheme(s).missing.map(k => (k === 'aadhaar' ? 'Aadhaar' : k === 'bank' ? 'Bank passbook' : k === 'land' ? 'Land proof' : k)).join(', ')}`}
                    </div>
                    {/* per-scheme required docs with upload */}
                    <div style={{ marginLeft: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                      {getRequiredDocsForScheme(s).map((dk) => {
                        const label = dk === 'aadhaar' ? 'Aadhaar' : dk === 'bank' ? 'Bank' : 'Land';
                        // For bank passbook: only show a confirmation checkbox (no upload allowed)
                        if (dk === 'bank') {
                          const confirmed = profile && profile.docs && profile.docs.confirmed && profile.docs.confirmed[dk];
                          return (
                            <label key={dk} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <input type="checkbox" checked={!!confirmed} onChange={() => toggleConfirmDoc(dk)} />
                              <span style={{ fontSize: 12 }}>{label} (confirm only)</span>
                            </label>
                          );
                        }
                        return (
                          <label key={dk} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="file" accept={dk === 'aadhaar' ? 'image/*' : '.pdf,image/*'} onChange={async (e) => {
                              const f = e.target.files && e.target.files[0];
                              if (!f) return;
                              await handleDocUpload(f, dk);
                            }} />
                            <span style={{ fontSize: 12 }}>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="scheme-actions">
                    <button className="btn secondary" onClick={() => {
                      setProgressState(ps => ({ ...ps, [s.id]: ps[s.id] || Array(s.steps.length).fill(false) }));
                      setStepsOpen(prev => ({ ...prev, [s.id]: !prev[s.id] }));
                      setTimeout(() => {
                        const el = document.querySelector(`#scheme-${s.id}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 120);
                    }}>{stepsOpen[s.id] ? 'Close Steps' : 'Open Steps'}</button>
                    <button className="btn" onClick={() => {
                      const flat = (s.steps || []).map(g => (g.title ? g.title + '. ' : '') + (g.items || []).join('. ')).join(' ');
                      speakText(`${s.title}. ${flat}`);
                    }} style={{ marginLeft: 8 }}>{t("ttsSteps")}</button>
                    <button className="btn ghost" onClick={() => stopSpeak()} style={{ marginLeft: 8 }}>Stop</button>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>Walkthrough:</strong>
                  <div className="walkthrough" style={{ background: "#f7fafc", padding: 8, borderRadius: 6 }}>
                    {s.video ? <video src={s.video} controls style={{ width: "100%" }} /> : <div style={{ color: "#666" }}>Video walkthrough not available. Admin can upload short screen recordings for each scheme (recommended).</div>}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </section>

      {/* Sharing & QR */}
      <section className="share-row" style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
        <div>
          <button className="btn" onClick={() => handleDownloadZIP()}>Download Application ZIP</button>
          <button className="btn" onClick={() => handleDownloadPDF()} style={{ marginLeft: 8 }}>Download PDF Kit</button>
          <button className="btn secondary" onClick={() => handleGenerateShareToken()} style={{ marginLeft: 8 }}>Generate Share QR</button>
        </div>
        <div>
            {qrToken && (
              <div className="qr-box" style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}>
                <div style={{ marginBottom: 6 }}>Scan to view packet (demo token)</div>
                <QRCode value={qrData || qrToken} size={96} />
                {/* Hidden QR canvas for PDF capture: render the same payload to a canvas element */}
                {qrData && (
                  <div style={{ position: 'absolute', left: -9999, top: -9999 }} aria-hidden>
                    <QRCode id="pdf-qr-canvas" value={qrData} size={256} renderAs="canvas" />
                  </div>
                )}
              </div>
            )}
        </div>
      </section>

      {/* Quick debug/viewer */}
      <section className="debug" style={{ marginTop: 18, color: "#666" }}>
        <small>Debug: OCR status length {ocrStatus.text ? ocrStatus.text.slice(0, 80) + "..." : "no ocr"}</small>
      </section>
    </div>
  );
}

// StepTrackerInner component: keeps local progress per scheme in parent's state
function StepTrackerInner({ scheme, progressState, setProgressState }) {
  const groups = scheme.steps || [];
  // progressState structure per scheme: { [schemeId]: { [groupIdx]: [bool,...] } }
  const schemeProgress = progressState[scheme.id] || {};

  const toggleItem = (gIdx, iIdx) => {
    const next = { ...progressState };
    next[scheme.id] = { ...(next[scheme.id] || {}) };
    const group = next[scheme.id][gIdx] ? [...next[scheme.id][gIdx]] : Array((groups[gIdx] && groups[gIdx].items.length) || 0).fill(false);
    group[iIdx] = !group[iIdx];
    next[scheme.id][gIdx] = group;
    setProgressState(next);
  };

  // compute totals
  let totalItems = 0, doneItems = 0;
  groups.forEach((g, gi) => {
    const items = (g.items || []);
    totalItems += items.length;
    const grpState = schemeProgress[gi] || Array(items.length).fill(false);
    doneItems += grpState.filter(Boolean).length;
  });
  const progress = totalItems === 0 ? 0 : Math.round((doneItems / totalItems) * 100);

  return (
    <div className="step-tracker" style={{ background: "#f4f8ff", padding: 10, borderRadius: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>Steps to Apply</strong>
        <div>{progress}%</div>
      </div>
      <div style={{ marginTop: 8 }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700 }}>{g.title}</div>
            <ol style={{ marginTop: 6 }}>
              {(g.items || []).map((it, ii) => {
                const checked = (schemeProgress[gi] && schemeProgress[gi][ii]) || false;
                return (
                  <li key={ii} style={{ marginTop: 6 }}>
                    <label>
                      <input type="checkbox" checked={checked} onChange={() => toggleItem(gi, ii)} /> {" "}
                      {it}
                    </label>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
      <div className="progress-bar" aria-hidden style={{ marginTop: 8 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
