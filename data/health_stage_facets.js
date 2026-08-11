/* Heal / health chain - per-stage Opportunities / Threats / Regulations for the S4 system schematic.
   SOURCED 2026-08-10 (research agent). NOTHING fabricated. Empty arrays = "not surfaced".
   Opportunities = frontier[F]/new[N] components verbatim from assets/component-library.json `health`
   (E-class + tracking items excluded per the bans). Threat = CANON §1 "The AI layer" (central diagnostics).
   Regulations = IM §3.1/§4.1/§4.3 (FDA/TGA/EU approval, TGA comparable-overseas pathway, NZ WAND,
   manufacture-covering approval) + im-sectional Heal callout (approval; reimbursement). */

var HEALTH_STAGE_FACETS = {
  "Biological discovery": { opp:["Single-cell analysis systems","Spatial-omics imaging","Organ-on-chip perfusion cartridges","Patient-specific organ-chip test beds"], threat:[], reg:[] },
  "Diagnostics": { opp:["Cartridge sample-to-answer molecular dx","Digital pathology scanners","Portable low-field MRI","Universal sample cartridges"], threat:["Central diagnostics"], reg:[] },
  "Product manufacture": { opp:["Continuous drug-manufacturing trains","Distributed modular microfactories","Closed automated cell processing","Bedside closed-loop cell-therapy units"], threat:[], reg:["FDA / TGA / European market approval - the durable moat, earned offshore","TGA comparable-overseas pathway (Class IIb review 12-18mo → 6-12mo)","Approval covering manufacture (Cyclopharm Technegas)"] },
  "Clinical infrastructure": { opp:["Autonomous internal delivery robots","Modular negative-pressure rooms","Reconfigurable utility-spine modules"], threat:[], reg:[] },
  "Intervention": { opp:["Robotic surgical manipulators","Additive patient-specific implants","Smart dressings with chemical sensing","Cooperative tools with physical no-go limits"], threat:[], reg:["NZ WAND post-market notification (no pre-market regime)","Approval; reimbursement"] },
  "Monitoring": { opp:["Continuous glucose/biochemical sensors","Wearable multi-parameter patches","Closed-loop insulin/anaesthesia delivery","Universal physiological-control hub"], threat:[], reg:[] },
  "Rehabilitation": { opp:["Powered exoskeletons","Myoelectric prostheses with feedback","Soft robotic rehab garments","Adaptive home-care utility docks"], threat:[], reg:[] },
  "Waste / recovery": { opp:["Reusable sterilised procedural kits","Robotic instrument sorting","Automated decontamination/certification cells"], threat:[], reg:[] }
};
if (typeof window !== "undefined") window.STAGE_FACETS = HEALTH_STAGE_FACETS;
