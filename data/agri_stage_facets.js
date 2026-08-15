/* Eat / agri chain - per-stage Opportunities / Threats / Regulations for the S3 system schematic.
   SOURCED 2026-08-10 (research agent).  Empty arrays = "not surfaced".
   Opportunities = frontier[F]/new[N] components verbatim from assets/component-library.json `agri`
   (E-class excluded; protein-alternatives / fermentation / traceability excluded per the bans).
   Threat = internal canon "The AI layer" (commodity traders). Regulations = internal source
   (biosecurity; approval to sell) + internal canon (Japan Smart Agriculture Technology Promotion Act, Oct 2024). */

var AGRI_STAGE_FACETS = {
  "Genetics / inputs": { opp:["Gene-editing delivery/screening","High-throughput phenotyping","Microbial fertiliser production","Climate-adaptive breeding chambers"], threat:[], reg:["Biosecurity - right to operate on germplasm, seed and biological inputs","Approval to sell - registration of agricultural inputs"] },
  "Soil / water prep": { opp:["Autonomous tractors","Variable-rate irrigation","Solar desalination/brackish treatment","Root-zone water cartridges"], threat:[], reg:[] },
  "Planting": { opp:["Small swarm cultivation robots","Real-time seed-depth/soil-contact sensing","Per-point planting heads (variety/depth/microbe)"], threat:[], reg:[] },
  "Production": { opp:["Root/canopy/atmosphere as three machines","Robotic transplant/prune/harvest","Dynamic-spectrum lighting","Multispectral/hyperspectral cameras"], threat:[], reg:["Japan Smart Agriculture Technology Promotion Act (Oct 2024)"] },
  "Protection": { opp:["Plant-level treatment robots (inspect/micro-dose/prune)","Camera-guided spot sprayers","Laser/electrical weed-control heads","Spore/airborne-pathogen detectors"], threat:[], reg:[] },
  "Harvest": { opp:["Vision-guided fruit/veg harvesters","Soft robotic grippers","Autonomous grain carts","Reconfigurable multi-crop harvesting platforms"], threat:[], reg:[] },
  "Processing": { opp:["Distributed farm-side food-conversion units","Pulsed-electric-field/high-pressure processing","Hyperspectral internal-quality inspection","Automated bruise/contamination detection"], threat:[], reg:[] },
  "Storage": { opp:["Solar-direct cold rooms","Predictive shelf-life sensors","Dynamic atmosphere packaging","Active-control produce containers"], threat:[], reg:[] },
  "Distribution": { opp:["Phase-change thermal packaging","Thermal-buffer freight containers (no diesel)"], threat:["Commodity traders"], reg:[] },
  "Nutrient recovery": { opp:["Farm nutrient routers (feed/fertiliser/energy/material)","Phosphorus-recovery reactors","Ammonia stripping/capture","Biochar pyrolysis units"], threat:[], reg:[] }
};
if (typeof window !== "undefined") window.STAGE_FACETS = AGRI_STAGE_FACETS;
