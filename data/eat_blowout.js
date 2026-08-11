/* Eat necessity - pickup-reel physical-part blow-out callouts.
   SOURCED 2026-08-10 from real corpus data (research agent). NOTHING fabricated.
   GP ruling 2026-08-10: strict library-backed variant - the four parts whose names trace to the
   component library. The two geometry-only parts (Star End-Plates, Auger Housing) were dropped.
   Machine geometry: _demo/eat.html (buildEat reel), viewBox 0 0 1080 620.
   Verb-part (green accent) = REEL DRIVE, per necessity-visuals.md line 35.
   Format mirrors the Power transformer blow-out (_demo/transformer-blowout.html):
     [ "NN", "PART TITLE", [note lines], [featureX, featureY in the reel's 1080x620 box], "L"|"R", boxY, accentBool ]

   Provenance (part -> library source):
     REEL DRUM       component-library agri.harvest[1] "Headers/cutters/threshing drums" · necessity-visuals L31 · geometry drum() eat.html L20-23,49
     SPRING TINES    component-library agri.harvest[1] "Headers" · geometry tines() eat.html L26-28,51
     PICKUP CONVEYOR component-library agri.harvest[6] "Conveyors/elevators/field bins" · geometry belt() eat.html L29-31,48
     REEL DRIVE      necessity-visuals L35 (the verb) · geometry drive() eat.html L32-38,51 · ACCENT

   On-machine sensors exist in the library but are NOT drawn in the reel geometry, so no sensor callout
   is included (correctly omitted, not fabricated).
   Coordinate note: reel is authored in its own 1080x620 box; when inlined into a taller blow-out frame,
   apply the parent's machine-group vertical offset. */

var EAT_REEL_VIEWBOX = "0 0 1080 620";
var EAT_REEL_CALL = [
  ["01","REEL DRUM",        ["the spinning barrel,","carries the tine bars"],    [492,321],"L", 96, false],
  ["02","SPRING TINES",     ["the fingers that comb","the crop off the ground"], [472,398],"L",300, false],
  ["03","PICKUP CONVEYOR",  ["the belt below; carries","crop back to the auger"],[570,530],"R", 96, false],
  ["04","REEL DRIVE",       ["what turns the reel;","sets the sweep"],           [949,412],"R",300, true]
];
