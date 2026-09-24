export type ServiceItem = { name: string; price: string };
export type ServiceGroup = {
  id: "repairs" | "sales" | "cctv" | "support";
  title: string;
  blurb: string;
  from: string;
  items: ServiceItem[];
};
export type Product = { name: string; brand: string; specs: string; display: string; price: number };

export const business = {
  name: "Levrone Technologies",
  phone: "082 049 9013",
  email: "brian@levronetech.co.za",
  address: "UFS, Bloemfontein, 9301",
  hours: "Mon-Fri: 08:00-16:00",
};

const i = (name: string, price: string): ServiceItem => ({ name, price });

export const serviceGroups: ServiceGroup[] = [
  {
    id: "repairs",
    title: "Laptop & Desktop Repairs",
    blurb: "Screen replacement, battery issues, keyboard repairs, motherboard fixes and hardware upgrades.",
    from: "From R350",
    items: [
      i("Screen Replacement", "From R750"), i("Battery Replacement", "From R450"),
      i("Keyboard Replacement", "From R350"), i("Motherboard Repairs", "From R1500"),
      i("Broken Hinges Fix", "From R350"), i("Case Replacement", "From R550"),
      i("RAM Upgrade", "From R350"), i("Storage Upgrade (SSD)", "From R750"),
      i("Network Adapter Repair", "From R450"), i("OS Installation (Win/Mac/Linux)", "From R350"),
      i("Virus Removal", "From R350"), i("Password Removal", "From R350"),
      i("Speed Optimization", "From R350"), i("Software Installation", "From R250"),
      i("Troubleshooting", "From R350"),
    ],
  },
  {
    id: "sales",
    title: "Laptop Sales",
    blurb: "New and refurbished laptops from Apple, HP, Dell, Lenovo, Asus and more.",
    from: "From R4,499",
    items: [
      i("Apple MacBook", "From R18,999"), i("HP Laptops", "From R8,999"),
      i("Dell Laptops", "From R9,499"), i("Lenovo Laptops", "From R8,499"),
      i("Asus Laptops", "From R7,999"), i("Acer Laptops", "From R6,999"),
      i("MSI Laptops", "From R12,499"), i("Refurbished Options", "From R4,499"),
      i("Custom PC Builds", "Quote Based"), i("Warranty Included", "1-2 Years"),
    ],
  },
  {
    id: "cctv",
    title: "CCTV Installation",
    blurb: "Security camera installation for homes and businesses, with full setup and configuration.",
    from: "From R2,500",
    items: [
      i("Home CCTV Package (2 cameras)", "From R2,500"), i("Home CCTV Package (4 cameras)", "From R4,500"),
      i("Business CCTV Package (8 cameras)", "From R8,500"), i("HD Camera Installation", "From R850/cam"),
      i("IP Camera Setup", "From R1,200/cam"), i("DVR/NVR Configuration", "From R1,500"),
      i("Remote Viewing Setup", "From R750"), i("Motion Detection Setup", "From R500"),
      i("CCTV Maintenance", "From R450"), i("System Upgrades", "Quote Based"),
    ],
  },
  {
    id: "support",
    title: "IT Support & Advice",
    blurb: "Technical support, system optimization, virus removal and expert IT consultation.",
    from: "From R250/hr",
    items: [
      i("Remote Support", "From R250/hr"), i("On-site Support", "From R450/hr"),
      i("Network Setup", "From R1,200"), i("WiFi Optimization", "From R650"),
      i("Data Backup Solutions", "From R450"), i("Data Recovery", "From R1,500"),
      i("Email Setup", "From R350"), i("Printer Setup", "From R450"),
      i("IT Consultation", "From R500/hr"), i("Business IT Solutions", "Quote Based"),
      i("Server Maintenance", "From R2,500"), i("Cloud Migration", "Quote Based"),
    ],
  },
];

export const products: Product[] = [
  { name: "MacBook Air M2", brand: "Apple", specs: "Apple M2 • 8GB • 256GB SSD", display: '13.6" Display', price: 18999 },
  { name: "HP Pavilion 15", brand: "HP", specs: "Intel i5 • 16GB • 512GB SSD", display: '15.6" Display', price: 12499 },
  { name: "Dell Inspiron 15", brand: "Dell", specs: "Intel i5 • 8GB • 256GB SSD", display: '15.6" Display', price: 11999 },
  { name: "Lenovo IdeaPad 5", brand: "Lenovo", specs: "Intel i5 • 16GB • 512GB SSD", display: '14" Display', price: 10999 },
  { name: "Asus VivoBook 15", brand: "Asus", specs: "Intel i3 • 8GB • 256GB SSD", display: '15.6" Display', price: 9499 },
  { name: "Acer Aspire 5", brand: "Acer", specs: "Intel i3 • 8GB • 256GB SSD", display: '15.6" Display', price: 8999 },
  { name: "MSI Modern 15", brand: "MSI", specs: "Intel i7 • 16GB • 512GB SSD", display: '15.6" Display', price: 13499 },
  { name: "MacBook Pro 14", brand: "Apple", specs: "Apple M1 Pro • 16GB • 512GB SSD", display: '14" Display', price: 28999 },
];

export const reasons = [
  ["Expert technicians", "Certified professionals with years of hands-on experience."],
  ["Quality parts", "Genuine and high-quality replacement parts for all repairs."],
  ["Fast service", "Most repairs completed within 24-48 hours."],
  ["Affordable pricing", "Competitive rates and transparent pricing, always."],
  ["Warranty protection", "All our work comes with a warranty."],
];
