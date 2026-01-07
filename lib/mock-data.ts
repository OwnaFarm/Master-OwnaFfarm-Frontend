// Mock data for demo auto-fill functionality

const firstNames = ["Ahmad", "Budi", "Dewi", "Siti", "Agus", "Rina", "Joko", "Wati", "Bambang", "Sri"]

const lastNames = [
  "Santoso",
  "Wijaya",
  "Kusuma",
  "Pratama",
  "Putra",
  "Sari",
  "Hidayat",
  "Nugroho",
  "Hartono",
  "Susanto",
]

const cities: Record<string, string[]> = {
  "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Depok", "Cimahi"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang", "Salatiga", "Pekalongan"],
  "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo", "Kediri", "Blitar"],
  Banten: ["Tangerang", "Serang", "Cilegon", "Tangerang Selatan"],
  "DKI Jakarta": ["Jakarta Selatan", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"],
  "Sumatera Utara": ["Medan", "Binjai", "Pematangsiantar", "Tebing Tinggi"],
  "Sumatera Barat": ["Padang", "Bukittinggi", "Payakumbuh", "Solok"],
  "Sumatera Selatan": ["Palembang", "Prabumulih", "Lubuklinggau"],
  Bali: ["Denpasar", "Singaraja", "Gianyar", "Tabanan"],
  "Kalimantan Barat": ["Pontianak", "Singkawang", "Ketapang"],
  "Kalimantan Timur": ["Samarinda", "Balikpapan", "Bontang"],
  "Sulawesi Selatan": ["Makassar", "Parepare", "Palopo"],
}

const districts = [
  "Cibiru",
  "Sukajadi",
  "Coblong",
  "Cicendo",
  "Buahbatu",
  "Klojen",
  "Lowokwaru",
  "Sukun",
  "Kedungkandang",
  "Blimbing",
]

const addresses = [
  "Jl. Raya Pertanian No. 45, RT 03/RW 05",
  "Kampung Tani Makmur, Blok C-12",
  "Jl. Sawah Indah No. 78, Gang Melati 3",
  "Dusun Subur Jaya, RT 02/RW 08",
  "Jl. Ladang Hijau No. 23, Komplek Agraria",
]

const businessTypes = ["Individual", "CV", "PT", "Koperasi"]
const banks = ["BCA", "BRI", "BNI", "Mandiri", "CIMB Niaga", "Bank Jago", "Bank Danamon", "Bank Permata"]
const provinces = [
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Banten",
  "DKI Jakarta",
  "Sumatera Utara",
  "Sumatera Barat",
  "Sumatera Selatan",
  "Bali",
  "Kalimantan Barat",
  "Kalimantan Timur",
  "Sulawesi Selatan",
]

const cropOptions = [
  "Padi (Rice)",
  "Jagung (Corn)",
  "Cabai (Chili)",
  "Tomat (Tomato)",
  "Bawang Merah (Shallot)",
  "Bawang Putih (Garlic)",
  "Kentang (Potato)",
  "Wortel (Carrot)",
  "Kopi (Coffee)",
  "Kelapa Sawit (Palm Oil)",
]

// Helper functions
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("")
}

function randomDate(startYear: number, endYear: number): string {
  const year = startYear + Math.floor(Math.random() * (endYear - startYear))
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Mock data generators
export function generatePersonalInfo() {
  const firstName = randomItem(firstNames)
  const lastName = randomItem(lastNames)
  const province = randomItem(provinces)
  const citiesInProvince = cities[province] || ["Unknown"]

  return {
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomDigits(3)}@gmail.com`,
    phoneNumber: `+628${randomDigits(10)}`,
    idNumber: randomDigits(16),
    dateOfBirth: randomDate(1970, 2000),
    address: randomItem(addresses),
    province: province,
    city: randomItem(citiesInProvince),
    district: randomItem(districts),
    postalCode: randomDigits(5),
  }
}

export function generateBusinessInfo() {
  const firstName = randomItem(firstNames)
  const lastName = randomItem(lastNames)
  const businessType = randomItem(businessTypes)

  return {
    businessType,
    businessName: businessType !== "Individual" ? `${randomItem(["PT", "CV"])} ${lastName} Agro Makmur` : "",
    npwp: randomDigits(15),
    bankName: randomItem(banks),
    bankAccountNumber: randomDigits(12),
    bankAccountName: `${firstName} ${lastName}`.toUpperCase(),
    yearsOfExperience: String(Math.floor(Math.random() * 20) + 1),
    cropsExpertise: randomItems(cropOptions, Math.floor(Math.random() * 4) + 2),
  }
}

// Create mock File objects for document uploads
export function generateMockDocuments() {
  const createMockFile = (name: string, type: string, sizeMB: number): File => {
    const bytes = sizeMB * 1024 * 1024
    const blob = new Blob([new ArrayBuffer(bytes)], { type })
    return new File([blob], name, { type })
  }

  return {
    ktpPhoto: createMockFile("KTP_Demo.jpg", "image/jpeg", 1.2),
    selfieWithKtp: createMockFile("Selfie_KTP_Demo.jpg", "image/jpeg", 1.5),
    npwpPhoto: createMockFile("NPWP_Demo.pdf", "application/pdf", 0.8),
    bankStatement: createMockFile("Bank_Statement_Demo.pdf", "application/pdf", 2.1),
    landCertificate: createMockFile("Land_Certificate_Demo.pdf", "application/pdf", 3.2),
    businessLicense: createMockFile("Business_License_Demo.pdf", "application/pdf", 1.8),
  }
}
