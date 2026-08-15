/* Power / energy chain - per-stage Opportunities / Threats / Regulations for the S2 system schematic.
   SOURCED 2026-08-10 (research agent).  Empty arrays = "not surfaced" (honest gap).
   Keys match the schematic stage labels exactly.
   Sources: opportunities = frontier[F]/new[N] components verbatim from assets/component-library.json `energy`;
     regulations = IM §4.1 (grid connection gated on market registration) + internal canon supply cross-cut
     (IRA Section 45X, EU Critical Raw Materials Act); threats = internal canon "The AI layer" (commodity traders).
   Carbon-accounting / DAC items deliberately excluded per the carbon-tracking ban.
   Gaps (correct, not fabricated): Component manufacture + Distribution have no F/N opp key; threats exist only
   at Distribution; regulations only at Extraction / Generation / Transmission. */

var ENERGY_STAGE_FACETS = {
  "Resource discovery": { opp:["Distributed acoustic sensing (fibre)","Autonomous subsurface survey robots","Reusable downhole laboratories"], threat:[], reg:[] },
  "Extraction": { opp:["Direct-lithium-extraction contactors/membranes","Robotic mining machinery","Selective electrochemical extraction heads","Closed-loop mines (waste rock to construction product)"], threat:[], reg:["IRA Section 45X","EU Critical Raw Materials Act"] },
  "Refining / conversion": { opp:["Electrolysers (alkaline/PEM/SOEC)","Closed-loop geothermal pipe systems","Advanced thermal/plasma drilling heads","Switchable multi-feedstock refinery reactors"], threat:[], reg:[] },
  "Component manufacture": { opp:[], threat:[], reg:[] },
  "Generation": { opp:["Perovskite-silicon tandem cells","Segmented/recyclable thermoplastic blades","SMR factory modules","Field-replaceable solar laminates"], threat:[], reg:["Grid connection gated on market registration"] },
  "Storage": { opp:["Iron-air/zinc/flow-battery stacks","Solid-state electrolytes","Chemistry-independent storage blocks","Distributed structural batteries"], threat:[], reg:[] },
  "Transmission": { opp:["Grid-forming inverters","Solid-state transformers","Dynamic line-rating sensors","Packet-router power-routing nodes"], threat:[], reg:["Grid connection gated on market registration"] },
  "Distribution": { opp:[], threat:["Commodity traders"], reg:[] },
  "End use": { opp:["High-temperature industrial heat pumps","Bidirectional V2G chargers","Universal waste-heat recovery manifolds"], threat:[], reg:[] },
  "Recovery": { opp:["Direct cathode recycling","Robotic disassembly cells","Mineralisation reactors","Embedded material-passport tags (survive smelting)"], threat:[], reg:[] }
};
if (typeof window !== "undefined") window.STAGE_FACETS = ENERGY_STAGE_FACETS;
