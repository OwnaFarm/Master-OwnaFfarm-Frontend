export type SubmissionStatus = "Pending" | "Verified" | "Rejected"

export interface FarmerSubmission {
  id: string
  farmerName: string
  businessType: string
  description: string
  location: string
  email: string
  phone: string
  landSize: string
  experience: string
  status: SubmissionStatus
  submittedAt: Date
  reviewedAt?: Date
}

export const dummySubmissions: FarmerSubmission[] = [
  {
    id: "1",
    farmerName: "Budi Santoso",
    businessType: "Rice Farming",
    description:
      "Traditional rice farming using organic methods. Looking to expand operations and improve irrigation systems for better yield.",
    location: "Yogyakarta, Central Java",
    email: "budi.santoso@example.com",
    phone: "+62 812-3456-7890",
    landSize: "5 hectares",
    experience: "15 years",
    status: "Pending",
    submittedAt: new Date("2026-01-12T10:30:00"),
  },
  {
    id: "2",
    farmerName: "Siti Nurhaliza",
    businessType: "Vegetable Farming",
    description:
      "Organic vegetable farming specializing in leafy greens and tomatoes. Seeking funding for greenhouse construction.",
    location: "Bandung, West Java",
    email: "siti.nurhaliza@example.com",
    phone: "+62 813-9876-5432",
    landSize: "2 hectares",
    experience: "8 years",
    status: "Pending",
    submittedAt: new Date("2026-01-11T14:20:00"),
  },
  {
    id: "3",
    farmerName: "Ahmad Wijaya",
    businessType: "Coffee Plantation",
    description:
      "Arabica coffee plantation in the highlands. Need support for processing equipment and certification for export.",
    location: "Aceh, Sumatra",
    email: "ahmad.wijaya@example.com",
    phone: "+62 821-5555-4444",
    landSize: "10 hectares",
    experience: "20 years",
    status: "Verified",
    submittedAt: new Date("2026-01-10T09:15:00"),
    reviewedAt: new Date("2026-01-11T16:45:00"),
  },
  {
    id: "4",
    farmerName: "Dewi Kusuma",
    businessType: "Fruit Orchard",
    description:
      "Mixed fruit orchard with mangoes, rambutans, and durians. Planning to implement drip irrigation and organic pest control.",
    location: "Malang, East Java",
    email: "dewi.kusuma@example.com",
    phone: "+62 822-7777-8888",
    landSize: "7 hectares",
    experience: "12 years",
    status: "Pending",
    submittedAt: new Date("2026-01-12T08:00:00"),
  },
  {
    id: "5",
    farmerName: "Rudi Hartono",
    businessType: "Livestock Farming",
    description:
      "Cattle and goat farming with focus on sustainable practices. Looking to expand breeding program and improve facilities.",
    location: "Semarang, Central Java",
    email: "rudi.hartono@example.com",
    phone: "+62 823-3333-2222",
    landSize: "15 hectares",
    experience: "10 years",
    status: "Verified",
    submittedAt: new Date("2026-01-09T11:30:00"),
    reviewedAt: new Date("2026-01-10T14:20:00"),
  },
  {
    id: "6",
    farmerName: "Kartika Sari",
    businessType: "Herb & Spice Farming",
    description:
      "Cultivating traditional Indonesian herbs and spices including turmeric, ginger, and lemongrass for local and export markets.",
    location: "Bogor, West Java",
    email: "kartika.sari@example.com",
    phone: "+62 824-9999-1111",
    landSize: "3 hectares",
    experience: "6 years",
    status: "Pending",
    submittedAt: new Date("2026-01-11T16:45:00"),
  },
  {
    id: "7",
    farmerName: "Hendra Gunawan",
    businessType: "Aquaculture",
    description:
      "Freshwater fish farming specializing in tilapia and catfish. Need investment for pond expansion and water filtration systems.",
    location: "Tangerang, Banten",
    email: "hendra.gunawan@example.com",
    phone: "+62 825-4444-6666",
    landSize: "4 hectares",
    experience: "9 years",
    status: "Rejected",
    submittedAt: new Date("2026-01-08T13:00:00"),
    reviewedAt: new Date("2026-01-09T10:30:00"),
  },
  {
    id: "8",
    farmerName: "Maya Lestari",
    businessType: "Flower Farming",
    description:
      "Commercial flower farming with roses, chrysanthemums, and orchids. Seeking support for climate-controlled greenhouse.",
    location: "Batu, East Java",
    email: "maya.lestari@example.com",
    phone: "+62 826-8888-9999",
    landSize: "1.5 hectares",
    experience: "5 years",
    status: "Pending",
    submittedAt: new Date("2026-01-12T12:15:00"),
  },
  {
    id: "9",
    farmerName: "Agus Prasetyo",
    businessType: "Corn Farming",
    description:
      "Large-scale corn production using modern farming techniques. Looking to implement precision agriculture technology.",
    location: "Lampung, Sumatra",
    email: "agus.prasetyo@example.com",
    phone: "+62 827-2222-3333",
    landSize: "20 hectares",
    experience: "18 years",
    status: "Verified",
    submittedAt: new Date("2026-01-07T15:30:00"),
    reviewedAt: new Date("2026-01-08T11:00:00"),
  },
  {
    id: "10",
    farmerName: "Rina Widiastuti",
    businessType: "Mushroom Cultivation",
    description:
      "Indoor mushroom cultivation focusing on oyster and shiitake varieties. Need funding for climate control and substrate preparation.",
    location: "Depok, West Java",
    email: "rina.widiastuti@example.com",
    phone: "+62 828-5555-7777",
    landSize: "0.5 hectares",
    experience: "4 years",
    status: "Pending",
    submittedAt: new Date("2026-01-12T07:45:00"),
  },
]
