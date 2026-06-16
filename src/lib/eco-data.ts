// Shared sample data + carbon calculation logic

export type Diet = "vegan" | "vegetarian" | "eggetarian" | "non-vegetarian";

export interface FootprintInput {
  carKm: number;        // km/day by car
  bikeKm: number;
  busKm: number;
  trainKm: number;
  flightHoursYear: number;
  electricityKwh: number; // per day
  waterLiters: number;    // per day
  diet: Diet;
  wasteKg: number;        // per day
}

// Approximate kg CO2e factors
const F = {
  car: 0.192,        // per km
  bike: 0,
  bus: 0.089,
  train: 0.041,
  flightHour: 90,    // per flight hour
  electricity: 0.45, // per kWh
  water: 0.000298,   // per liter
  waste: 1.9,        // per kg
  diet: { vegan: 1.5, vegetarian: 1.7, eggetarian: 2.2, "non-vegetarian": 3.3 } as Record<Diet, number>,
};

export function calcDaily(i: FootprintInput) {
  const transport =
    i.carKm * F.car + i.bikeKm * F.bike + i.busKm * F.bus + i.trainKm * F.train +
    (i.flightHoursYear * F.flightHour) / 365;
  const energy = i.electricityKwh * F.electricity;
  const water = i.waterLiters * F.water;
  const food = F.diet[i.diet];
  const waste = i.wasteKg * F.waste;
  const total = transport + energy + water + food + waste;
  return { transport, energy, water, food, waste, total };
}

export function impactLevel(dailyKg: number) {
  if (dailyKg < 6) return { label: "Excellent", tone: "leaf" as const, desc: "Well below the global average — keep it up." };
  if (dailyKg < 12) return { label: "Good", tone: "ocean" as const, desc: "Better than average. Small tweaks go a long way." };
  if (dailyKg < 20) return { label: "Moderate", tone: "sun" as const, desc: "Around the global average. Plenty of room to reduce." };
  return { label: "High", tone: "coral" as const, desc: "Above average. Try the suggestions below to cut emissions." };
}

export function treesEquivalent(annualKg: number) {
  // 1 mature tree ~ 21 kg CO2 / year
  return Math.round(annualKg / 21);
}

export function recommendations(b: ReturnType<typeof calcDaily>, i: FootprintInput): { title: string; body: string; icon: string }[] {
  const recs: { title: string; body: string; icon: string }[] = [];
  if (b.transport > 3) recs.push({ icon: "🚆", title: "Swap car trips for transit", body: "Replacing 20km of daily driving with train cuts ~3 kg CO₂/day." });
  if (i.carKm > 5) recs.push({ icon: "🚴", title: "Bike short trips", body: "Trips under 5 km are perfect candidates for cycling — zero emissions, real cardio." });
  if (b.energy > 4) recs.push({ icon: "💡", title: "Audit your electricity", body: "Switch to LEDs, unplug idle devices, and consider a green energy tariff." });
  if (b.food > 2.5) recs.push({ icon: "🥗", title: "Try meatless days", body: "Two plant-based days per week can cut ~15% off your food footprint." });
  if (b.waste > 1) recs.push({ icon: "♻️", title: "Compost & recycle", body: "Separating organics keeps methane out of landfills." });
  if (i.waterLiters > 150) recs.push({ icon: "💧", title: "Shorter showers", body: "Cutting shower time by 2 minutes saves ~20 liters and the energy to heat it." });
  if (i.flightHoursYear > 10) recs.push({ icon: "✈️", title: "Fly less, stay longer", body: "Consolidate trips and pick direct flights to reduce per-trip emissions." });
  recs.push({ icon: "🌳", title: "Plant or sponsor a tree", body: "Each mature tree absorbs ~21 kg CO₂ per year. Small offsets add up." });
  return recs.slice(0, 6);
}

// History sample for dashboard
export const weeklyHistory = [
  { day: "Mon", kg: 14.2 }, { day: "Tue", kg: 12.8 }, { day: "Wed", kg: 11.5 },
  { day: "Thu", kg: 13.1 }, { day: "Fri", kg: 10.4 }, { day: "Sat", kg: 8.9 }, { day: "Sun", kg: 9.6 },
];

export const monthlyHistory = Array.from({ length: 12 }, (_, m) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m],
  kg: Math.round(280 + Math.sin(m / 1.5) * 60 + (12 - m) * 4),
}));

export const challenges = [
  { id: 1, title: "Meatless Monday", points: 50, period: "Daily",   desc: "Skip meat for a day and log your meal.", icon: "🥗" },
  { id: 2, title: "Bike to work",    points: 80, period: "Daily",   desc: "Replace your car commute with cycling.", icon: "🚴" },
  { id: 3, title: "Zero-waste lunch",points: 40, period: "Daily",   desc: "Bring lunch in reusable containers.",    icon: "🥡" },
  { id: 4, title: "Unplug night",    points: 30, period: "Weekly",  desc: "Unplug all idle electronics overnight.", icon: "🔌" },
  { id: 5, title: "5-min shower",    points: 25, period: "Daily",   desc: "Keep every shower under 5 minutes.",     icon: "🚿" },
  { id: 6, title: "Plant a sapling", points: 200,period: "Monthly", desc: "Plant a tree in your community.",        icon: "🌱" },
  { id: 7, title: "Local groceries", points: 60, period: "Weekly",  desc: "Shop only local & seasonal produce.",    icon: "🧺" },
  { id: 8, title: "Public transit week", points: 150, period: "Weekly", desc: "Use only transit, bike or walking.", icon: "🚆" },
];

export const leaderboard = [
  { rank: 1, name: "Aanya Sharma",  points: 4820, saved: 612, badge: "🌳" },
  { rank: 2, name: "Liam Chen",     points: 4510, saved: 580, badge: "🌿" },
  { rank: 3, name: "Sofia Rossi",   points: 4290, saved: 553, badge: "🌿" },
  { rank: 4, name: "Mateo García",  points: 3980, saved: 510, badge: "🍃" },
  { rank: 5, name: "Priya Patel",   points: 3760, saved: 488, badge: "🍃" },
  { rank: 6, name: "Noah Williams", points: 3540, saved: 461, badge: "🍃" },
  { rank: 7, name: "Hana Tanaka",   points: 3320, saved: 432, badge: "🌱" },
  { rank: 8, name: "Daniel Cohen",  points: 3110, saved: 410, badge: "🌱" },
  { rank: 9, name: "You",           points: 2980, saved: 388, badge: "🌱", you: true },
  { rank: 10,name: "Zara Ahmed",    points: 2840, saved: 372, badge: "🌱" },
];

export const articles = [
  { id: "climate-101",  title: "Climate Change 101: A Practical Primer", category: "Climate", read: "6 min", excerpt: "What greenhouse gases actually do, why 1.5°C matters, and the levers that move the needle.", emoji: "🌍" },
  { id: "renewables",   title: "How Renewables Are Reshaping the Grid",  category: "Energy",  read: "8 min", excerpt: "Solar, wind, storage, and why the next decade will look nothing like the last.", emoji: "☀️" },
  { id: "diet-impact",  title: "Your Plate's Footprint",                 category: "Food",    read: "5 min", excerpt: "From beef to lentils — visualizing the CO₂ cost of common meals.", emoji: "🥦" },
  { id: "transport",    title: "Beyond the Car: Smarter Commutes",       category: "Mobility",read: "7 min", excerpt: "When EVs win, when transit wins, and when your bike beats both.", emoji: "🚲" },
  { id: "home-energy",  title: "10 Home Tweaks That Actually Cut Bills", category: "Home",    read: "4 min", excerpt: "The quick wins that hit your footprint and your wallet at the same time.", emoji: "🏡" },
  { id: "offsets",      title: "Are Carbon Offsets Worth It?",           category: "Policy",  read: "9 min", excerpt: "A clear-eyed look at what offsets do — and don't — solve.", emoji: "🌳" },
];

export const badges = [
  { name: "First Step",       emoji: "👣", desc: "Logged your first footprint",    earned: true },
  { name: "Green Week",       emoji: "🍃", desc: "7 days under 12 kg CO₂",         earned: true },
  { name: "Transit Pro",      emoji: "🚆", desc: "30 transit trips logged",         earned: true },
  { name: "Plant-Forward",    emoji: "🥗", desc: "20 plant-based meals",           earned: false },
  { name: "Water Saver",      emoji: "💧", desc: "Cut water use by 25%",           earned: false },
  { name: "Tree Champion",    emoji: "🌳", desc: "Offset 1 tonne of CO₂",          earned: false },
];
