// Intro text shown at the top of the box.
export const ABOUT = [
  "Hackforge 2026 is FOSS Club MPSTME X CSI MPSTME's first overnight hackathon: a 24-hour sprint for students who want to solve hard problems with real engineering.",
  'The brief is simple. Take on a complex problem and forge a dependable, working solution overnight—not just a pitch or prototype.',
]

// Event flow, shown in order. The overnight hackathon step lists the two tracks.
export const FLOW = [
  {
    step: '01',
    title: 'Hackathon workshop',
    when: '16 Oct 2026 · 5:00 PM — 8:00 PM · MPSTME',
  },
  {
    step: '02',
    title: 'Overnight hackathon',
    when: '17 Oct 2026, 7:00 PM — 18 Oct 2026, 3:00 PM · MPSTME',
    tracks: [
      { name: 'Intermediate track', line: 'Build a dependable system and test it in the real world.' },
      { name: 'Advanced track', line: 'Take on deeper constraints, designed for scale and failure.' },
    ],
  },
  {
    step: '03',
    title: 'Judging',
    when: '3:00 PM — 6:00 PM',
  },
]

// Blank undertaking form. Put the PDF at public/assets/undertaking-form.pdf
// or change this path.
export const UNDERTAKING_PDF_URL = '/assets/undertaking-form.pdf'

// Google Drive folder where participants upload the scanned undertaking.
export const DRIVE_UPLOAD_URL = 'https://drive.google.com/drive/folders/15H6NspB3AI2XKgPYqCQ-6_UfFoAcjTfg?usp=sharing'

// Google Apps Script web app URL. It saves each submission as a row in your Google Sheet.
export const SUBMIT_URL = 'https://script.google.com/macros/s/AKfycbzinNpV57FgrpiQp_TTDIDtioTzhlC6Yb4887ApMlpUBTdfKwDoDG_PDFsq6rTrbzXE/exec'

// Key used to keep the form values in the browser until submission.
export const DRAFT_KEY = 'hackforge-undertaking-draft'
