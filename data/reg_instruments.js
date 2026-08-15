/* S7 regulatory timeline - the AU/JP/NZ in-mandate register. 33 enforceable + 9 frameworks.
   SOURCED 2026-07-20/21 to primary legislation (research agent), from:
     internal regulatory source pass,JP,NZ}_2026-07-20.md + Frameworks_and_Guidelines_2026-07-21.md.
    Names shortened for display; full titles + primary-source URLs in the source files.
   NOTE: BIOSECURE / FDA AI-device (6→295) / ICH Q13 / CMS waiver are US-global "why-now" evidence
   (internal canon/§3), NOT part of this register - kept separate to preserve the 14/11/8 arithmetic.
   yr places the row on the axis; yr<2020 = the standing base. Forecast rows (status "expected") are
   real phased/expected milestones flagged by the sourcing pass, shown dashed in 2027+. */
var REG_INSTRUMENTS = [
  // ---- standing base (pre-2020) ----
  {c:"JP",name:"JAS Act (agricultural standards)",body:"MAFF",date:"1950",yr:1950,type:"enforceable",status:"effective"},
  {c:"JP",name:"PMD Act (pharma & devices)",body:"PMDA / MHLW",date:"1961",yr:1961,type:"enforceable",status:"effective"},
  {c:"NZ",name:"Medicines Act 1981",body:"Medsafe",date:"1981",yr:1981,type:"enforceable",status:"effective"},
  {c:"AU",name:"Privacy Act 1988",body:"OAIC",date:"1989",yr:1989,type:"enforceable",status:"effective"},
  {c:"AU",name:"Therapeutic Goods Act 1989",body:"TGA",date:"1991",yr:1991,type:"enforceable",status:"effective"},
  {c:"AU",name:"Food Standards ANZ Act 1991",body:"FSANZ",date:"1991",yr:1991,type:"enforceable",status:"effective"},
  {c:"AU",name:"Agvet Chemicals Code Act 1994",body:"APVMA",date:"1995",yr:1995,type:"enforceable",status:"effective"},
  {c:"NZ",name:"Hazardous Substances & New Organisms Act 1996",body:"EPA",date:"1996",yr:1996,type:"enforceable",status:"effective"},
  {c:"NZ",name:"Animal Products Act 1999",body:"MPI",date:"1999",yr:1999,type:"enforceable",status:"effective"},
  {c:"AU",name:"Gene Technology Act 2000",body:"OGTR",date:"2001",yr:2001,type:"enforceable",status:"effective"},
  {c:"NZ",name:"Agricultural Compounds & Vet Medicines Act 1997",body:"MPI",date:"2001",yr:2001,type:"enforceable",status:"effective"},
  {c:"NZ",name:"WAND scheme (Medical Devices Regs 2003)",body:"Medsafe",date:"2003",yr:2003,type:"enforceable",status:"effective"},
  {c:"JP",name:"Cartagena Act (GMO / biodiversity)",body:"MAFF / METI / MEXT",date:"2004",yr:2004,type:"enforceable",status:"effective"},
  {c:"NZ",name:"NZ ETS (Climate Change Response Act, Pt 4)",body:"EPA",date:"2008",yr:2008,type:"enforceable",status:"effective"},
  {c:"JP",name:"FIT / FIP renewable-electricity Act",body:"METI",date:"2012",yr:2012,type:"enforceable",status:"effective"},
  {c:"JP",name:"Food Labelling Act",body:"Consumer Affairs Agency",date:"2015",yr:2015,type:"enforceable",status:"effective"},
  {c:"NZ",name:"Food Act 2014",body:"MPI",date:"2016",yr:2016,type:"enforceable",status:"effective"},
  {c:"AU",name:"TG priority + provisional approval pathways",body:"TGA",date:"2018",yr:2018,type:"enforceable",status:"effective"},
  {c:"AU",name:"AI Ethics Principles",body:"DISR",date:"2019",yr:2019,type:"framework",status:"effective"},
  {c:"AU",name:"National Electricity Rules",body:"AEMC / AEMO",date:"standing",yr:2019,type:"enforceable",status:"effective"},
  // ---- the net-new tick (2020+) ----
  {c:"JP",name:"PMD Act IDATEN + conditional early approval",body:"PMDA",date:"Sep 2020",yr:2020,type:"enforceable",status:"effective"},
  {c:"JP",name:"Food Sanitation Act, mandatory HACCP",body:"MHLW",date:"Jun 2020",yr:2020,type:"enforceable",status:"effective"},
  {c:"NZ",name:"Privacy Act 2020",body:"OPC",date:"Dec 2020",yr:2020,type:"enforceable",status:"effective"},
  {c:"JP",name:"DASH for SaMD",body:"MHLW",date:"2020",yr:2020,type:"framework",status:"effective"},
  {c:"NZ",name:"Algorithm Charter for Aotearoa",body:"Stats NZ",date:"Jul 2020",yr:2020,type:"framework",status:"effective"},
  {c:"AU",name:"FIRB national-security investment screening",body:"Treasury / FIRB",date:"2021",yr:2021,type:"enforceable",status:"effective"},
  {c:"AU",name:"Software-as-a-medical-device regulation",body:"TGA",date:"Feb 2021",yr:2021,type:"enforceable",status:"effective"},
  {c:"JP",name:"APPI 2020 amendment (personal information)",body:"PPC",date:"Apr 2022",yr:2022,type:"enforceable",status:"effective"},
  {c:"JP",name:"Economic Security Promotion Act (critical minerals)",body:"Cabinet Office / METI",date:"Aug 2022",yr:2022,type:"enforceable",status:"effective"},
  {c:"JP",name:"METI AI Governance Guidelines",body:"METI",date:"Jan 2022",yr:2022,type:"framework",status:"effective"},
  {c:"JP",name:"GX Promotion Act",body:"METI",date:"Jun 2023",yr:2023,type:"enforceable",status:"effective"},
  {c:"AU",name:"Safeguard Mechanism (Crediting) Amendment Act 2023",body:"Clean Energy Regulator",date:"Jul 2023",yr:2023,type:"enforceable",status:"effective"},
  {c:"AU",name:"Food Standards Code 3.2.2A, food-safety tools",body:"FSANZ",date:"Dec 2023",yr:2023,type:"enforceable",status:"effective"},
  {c:"JP",name:"METI Critical Minerals Strategy",body:"METI",date:"Jan 2023",yr:2023,type:"framework",status:"effective"},
  {c:"JP",name:"PMDA AI/ML Medical Device Guidance",body:"PMDA",date:"2023",yr:2023,type:"framework",status:"effective"},
  {c:"AU",name:"Critical Minerals Strategy 2023-2030",body:"DISR",date:"Jun 2023",yr:2023,type:"framework",status:"effective"},
  {c:"NZ",name:"Critical Minerals List & Strategy",body:"MBIE / NZP&M",date:"Sep 2024",yr:2024,type:"framework",status:"effective"},
  {c:"AU",name:"Voluntary AI Safety Standard (no obligation)",body:"DISR / NAIC",date:"Sep 2024",yr:2024,type:"framework",status:"effective"},
  {c:"AU",name:"Critical Minerals Production Tax Incentive (CMPTI)",body:"Treasury / ATO",date:"Feb 2025",yr:2025,type:"enforceable",status:"transitional"},
  {c:"AU",name:"AusUDID unique device identification",body:"TGA",date:"Mar 2025",yr:2025,type:"enforceable",status:"effective"},
  {c:"JP",name:"AI Promotion Act",body:"Cabinet Office (AI Strategy HQ)",date:"Sep 2025",yr:2025,type:"enforceable",status:"effective"},
  {c:"AU",name:"Medical-device adverse-event reporting (ASDER)",body:"TGA",date:"Mar 2026",yr:2026,type:"enforceable",status:"effective"},
  // ---- global instruments + recognition pathways re-pricing / multiplying reach across exit markets
  //      (internal canon/§3 net-new + line 62 reliance pathways; CONTEXT, NOT part of the AU/JP/NZ 33) ----
  {c:"AMER",name:"CMS hospital-at-home reimbursement waiver",body:"CMS",date:"2020",yr:2020,type:"enforceable",status:"effective",global:true},
  {c:"AMER",name:"IRA Section 45X (domestic-content)",body:"US Treasury / IRS",date:"2022",yr:2022,type:"enforceable",status:"effective",global:true},
  {c:"AMER",name:"FDA AI-device authorisations (6 → 295)",body:"FDA",date:"2015→2025",yr:2025,type:"enforceable",status:"effective",global:true},
  {c:"AMER",name:"BIOSECURE Act",body:"US Congress",date:"Dec 2025",yr:2025,type:"enforceable",status:"enacted",global:true},
  {c:"CA",name:"Access Consortium reliance (Health Canada)",body:"Access Consortium",date:"2020",yr:2020,type:"framework",status:"effective",global:true},
  {c:"UKI",name:"UK MHRA reliance (Access Consortium)",body:"MHRA",date:"2020",yr:2020,type:"framework",status:"effective",global:true},
  {c:"GCC",name:"GCC centralized registration procedure",body:"GCC-DR",date:"standing",yr:2019,type:"enforceable",status:"effective",global:true},
  {c:"EU",name:"EU AI Act (high-risk class)",body:"European Commission",date:"2024",yr:2024,type:"enforceable",status:"effective",global:true},
  {c:"EU",name:"EU Critical Raw Materials Act",body:"European Commission",date:"2024",yr:2024,type:"enforceable",status:"effective",global:true},
  {c:"GL",name:"ICH Q13 continuous manufacturing",body:"ICH",date:"2023",yr:2023,type:"enforceable",status:"effective",global:true},
  {c:"GL",name:"WHO Listed Authority tiers",body:"WHO",date:"2022",yr:2022,type:"framework",status:"effective",global:true},
  {c:"GL",name:"PIC/S GMP mutual reliance",body:"PIC/S",date:"standing",yr:2019,type:"framework",status:"effective",global:true},
  // ---- forecast (real phased / expected milestones) ----
  {c:"AU",name:"CMPTI 10% offset claimable",body:"ATO",date:"Jul 2027",yr:2027,type:"enforceable",status:"expected"},
  {c:"AU",name:"ASDER Stage 2 (medium-risk devices)",body:"TGA",date:"Apr 2028",yr:2028,type:"enforceable",status:"expected"},
  {c:"NZ",name:"Medical Products regime (TP Act replacement)",body:"Medsafe",date:"~2030",yr:2030,type:"enforceable",status:"expected"},
  {c:"AU",name:"AusUDID full labelling milestone",body:"TGA",date:"2030",yr:2030,type:"enforceable",status:"expected"}
];
if (typeof window !== "undefined") window.REG_INSTRUMENTS = REG_INSTRUMENTS;
