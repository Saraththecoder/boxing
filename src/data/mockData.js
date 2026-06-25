// Mock Seed Data for Apex Boxing Academy

export const initialStudents = [
  {
    id: "STU-001",
    name: "Marcus 'The Hammer' Vance",
    email: "marcus.vance@gmail.com",
    phone: "+1 (555) 124-5678",
    emergencyContact: {
      name: "Linda Vance",
      relation: "Mother",
      phone: "+1 (555) 124-5679"
    },
    age: 24,
    weight: 79.5, // kg
    batch: "Elite Competitors",
    status: "Active",
    joinDate: "2025-01-15",
    membershipType: "Annual",
    feeAmount: 150
  },
  {
    id: "STU-002",
    name: "Sarah 'The Sting' Connor",
    email: "sconnor@cyberdyne.io",
    phone: "+1 (555) 987-6543",
    emergencyContact: {
      name: "John Connor",
      relation: "Son",
      phone: "+1 (555) 987-6500"
    },
    age: 29,
    weight: 62.0,
    batch: "Morning Warriors",
    status: "Active",
    joinDate: "2025-03-10",
    membershipType: "Monthly",
    feeAmount: 80
  },
  {
    id: "STU-003",
    name: "Carlos 'El Toro' Rodriguez",
    email: "carlos.rod@yahoo.com",
    phone: "+1 (555) 234-5678",
    emergencyContact: {
      name: "Sofia Rodriguez",
      relation: "Spouse",
      phone: "+1 (555) 234-5670"
    },
    age: 33,
    weight: 91.2,
    batch: "Evening Beginners",
    status: "Active",
    joinDate: "2025-04-01",
    membershipType: "Quarterly",
    feeAmount: 220
  },
  {
    id: "STU-004",
    name: "Aisha 'Lightning' Bello",
    email: "aisha.bello@outlook.com",
    phone: "+1 (555) 345-6789",
    emergencyContact: {
      name: "Idris Bello",
      relation: "Father",
      phone: "+1 (555) 345-6780"
    },
    age: 19,
    weight: 56.4,
    batch: "Elite Competitors",
    status: "Active",
    joinDate: "2025-02-20",
    membershipType: "Monthly",
    feeAmount: 80
  },
  {
    id: "STU-005",
    name: "Jake 'The Cobra' Jenkins",
    email: "jake.cobra@gmail.com",
    phone: "+1 (555) 456-7890",
    emergencyContact: {
      name: "Mary Jenkins",
      relation: "Sister",
      phone: "+1 (555) 456-7891"
    },
    age: 26,
    weight: 71.0,
    batch: "Evening Beginners",
    status: "Inactive",
    joinDate: "2024-09-12",
    membershipType: "Monthly",
    feeAmount: 80
  },
  {
    id: "STU-006",
    name: "Viktor 'The Wall' Drago",
    email: "vdrago@siberian.box",
    phone: "+1 (555) 567-8901",
    emergencyContact: {
      name: "Ivan Drago",
      relation: "Father",
      phone: "+1 (555) 567-8900"
    },
    age: 23,
    weight: 104.3,
    batch: "Elite Competitors",
    status: "Active",
    joinDate: "2025-05-15",
    membershipType: "Quarterly",
    feeAmount: 220
  },
  {
    id: "STU-007",
    name: "Emily 'Flash' Watson",
    email: "emily.watson@gmail.com",
    phone: "+1 (555) 678-9012",
    emergencyContact: {
      name: "Robert Watson",
      relation: "Spouse",
      phone: "+1 (555) 678-9010"
    },
    age: 27,
    weight: 60.5,
    batch: "Morning Warriors",
    status: "Active",
    joinDate: "2025-02-05",
    membershipType: "Monthly",
    feeAmount: 80
  },
  {
    id: "STU-008",
    name: "Leo 'Iron' Sterling",
    email: "leo.sterling@sterling.com",
    phone: "+1 (555) 789-0123",
    emergencyContact: {
      name: "Grace Sterling",
      relation: "Mother",
      phone: "+1 (555) 789-0120"
    },
    age: 21,
    weight: 66.8,
    batch: "Morning Warriors",
    status: "Active",
    joinDate: "2025-05-01",
    membershipType: "Annual",
    feeAmount: 750
  },
  {
    id: "STU-009",
    name: "Ray 'Thunder' Kelly",
    email: "ray.kelly@hotmail.com",
    phone: "+1 (555) 890-1234",
    emergencyContact: {
      name: "Theresa Kelly",
      relation: "Wife",
      phone: "+1 (555) 890-1230"
    },
    age: 38,
    weight: 84.1,
    batch: "Evening Beginners",
    status: "Active",
    joinDate: "2025-01-10",
    membershipType: "Monthly",
    feeAmount: 80
  },
  {
    id: "STU-010",
    name: "Daniel 'Danny' LaRusso",
    email: "danny.l@miyagi-do.org",
    phone: "+1 (555) 901-2345",
    emergencyContact: {
      name: "Amanda LaRusso",
      relation: "Wife",
      phone: "+1 (555) 901-2340"
    },
    age: 41,
    weight: 74.0,
    batch: "Morning Warriors",
    status: "Inactive",
    joinDate: "2024-11-20",
    membershipType: "Quarterly",
    feeAmount: 220
  }
];

export const initialTrainers = [
  { id: "TRN-001", name: "Coach Sullivan 'Mick' Dunn", role: "Head Trainer", status: "Active" },
  { id: "TRN-002", name: "Coach Buster Douglas", role: "Sparring Coach", status: "Active" },
  { id: "TRN-003", name: "Coach Lucia Rijker", role: "Strength & Conditioning", status: "Active" }
];

export const initialTrainerAttendance = [
  { id: "TA-01", trainerId: "TRN-001", date: "2026-06-25", status: "Present" },
  { id: "TA-02", trainerId: "TRN-002", date: "2026-06-25", status: "Present" },
  { id: "TA-03", trainerId: "TRN-003", date: "2026-06-25", status: "Absent" },
  { id: "TA-04", trainerId: "TRN-001", date: "2026-06-24", status: "Present" },
  { id: "TA-05", trainerId: "TRN-002", date: "2026-06-24", status: "Present" },
  { id: "TA-06", trainerId: "TRN-003", date: "2026-06-24", status: "Present" }
];

export const initialAttendance = [
  // 2026-06-25 (Today)
  { id: "ATT-101", studentId: "STU-001", date: "2026-06-25", status: "Present" },
  { id: "ATT-102", studentId: "STU-002", date: "2026-06-25", status: "Present" },
  { id: "ATT-103", studentId: "STU-003", date: "2026-06-25", status: "Absent" },
  { id: "ATT-104", studentId: "STU-004", date: "2026-06-25", status: "Present" },
  { id: "ATT-105", studentId: "STU-006", date: "2026-06-25", status: "Present" },
  { id: "ATT-106", studentId: "STU-007", date: "2026-06-25", status: "Absent" },
  { id: "ATT-107", studentId: "STU-008", date: "2026-06-25", status: "Present" },
  { id: "ATT-108", studentId: "STU-009", date: "2026-06-25", status: "Present" },
  
  // 2026-06-24 (Yesterday)
  { id: "ATT-091", studentId: "STU-001", date: "2026-06-24", status: "Present" },
  { id: "ATT-092", studentId: "STU-002", date: "2026-06-24", status: "Present" },
  { id: "ATT-093", studentId: "STU-003", date: "2026-06-24", status: "Present" },
  { id: "ATT-094", studentId: "STU-004", date: "2026-06-24", status: "Present" },
  { id: "ATT-095", studentId: "STU-006", date: "2026-06-24", status: "Absent" },
  { id: "ATT-096", studentId: "STU-007", date: "2026-06-24", status: "Present" },
  { id: "ATT-097", studentId: "STU-008", date: "2026-06-24", status: "Present" },
  { id: "ATT-098", studentId: "STU-009", date: "2026-06-24", status: "Present" },

  // 2026-06-23
  { id: "ATT-081", studentId: "STU-001", date: "2026-06-23", status: "Present" },
  { id: "ATT-082", studentId: "STU-002", date: "2026-06-23", status: "Present" },
  { id: "ATT-083", studentId: "STU-003", date: "2026-06-23", status: "Absent" },
  { id: "ATT-084", studentId: "STU-004", date: "2026-06-23", status: "Present" },
  { id: "ATT-085", studentId: "STU-006", date: "2026-06-23", status: "Present" },
  { id: "ATT-086", studentId: "STU-007", date: "2026-06-23", status: "Present" },
  { id: "ATT-087", studentId: "STU-008", date: "2026-06-23", status: "Absent" },
  { id: "ATT-089", studentId: "STU-009", date: "2026-06-23", status: "Present" }
];

export const initialPayments = [
  {
    id: "PAY-001",
    studentId: "STU-001",
    amount: 150,
    paymentDate: "2026-06-01",
    monthFor: "2026-06",
    paymentMethod: "Credit Card",
    receiptNumber: "REC-260601-01",
    status: "Paid"
  },
  {
    id: "PAY-002",
    studentId: "STU-002",
    amount: 80,
    paymentDate: "2026-06-03",
    monthFor: "2026-06",
    paymentMethod: "Cash",
    receiptNumber: "REC-260603-02",
    status: "Paid"
  },
  {
    id: "PAY-003",
    studentId: "STU-004",
    amount: 80,
    paymentDate: "2026-06-05",
    monthFor: "2026-06",
    paymentMethod: "Bank Transfer",
    receiptNumber: "REC-260605-03",
    status: "Paid"
  },
  {
    id: "PAY-004",
    studentId: "STU-007",
    amount: 80,
    paymentDate: "2026-06-04",
    monthFor: "2026-06",
    paymentMethod: "UPI",
    receiptNumber: "REC-260604-04",
    status: "Paid"
  },
  {
    id: "PAY-005",
    studentId: "STU-008",
    amount: 750,
    paymentDate: "2026-05-01",
    monthFor: "2026-05",
    paymentMethod: "Credit Card",
    receiptNumber: "REC-260501-05",
    status: "Paid"
  },
  {
    id: "PAY-006",
    studentId: "STU-003",
    amount: 220,
    paymentDate: "2026-04-05",
    monthFor: "2026-04",
    paymentMethod: "Cash",
    receiptNumber: "REC-260405-06",
    status: "Paid"
  }
];

export const initialAnnouncements = [
  {
    id: "ANN-001",
    title: "Summer Golden Gloves Championship",
    description: "Registration for the Summer Golden Gloves tournament is now open. All active competitors in the Elite Competitors batch must report to Coach Sullivan for weight screening and fight license checks before Friday. Sparring sessions will be extended to 5 rounds starting next week.",
    category: "Tournament",
    date: "2026-06-20",
    time: "10:30 AM",
    author: "Coach Sullivan"
  },
  {
    id: "ANN-002",
    title: "High-Altitude Conditioning Camp",
    description: "We are organizing a 3-day high-altitude training camp in Aspen from July 15th to July 18th. Focus areas will be endurance, oxygen efficiency, and outdoor roadwork. Spots are limited to 15 boxers. Fee is $250 inclusive of stay & nutrition.",
    category: "Camp",
    date: "2026-06-22",
    time: "02:15 PM",
    author: "Coach Rijker"
  },
  {
    id: "ANN-003",
    title: "Independence Day Gym Closure",
    description: "Please note that Apex Boxing Academy will be closed on July 4th in observance of Independence Day. Regular classes will resume on Monday, July 6th. Have a great and safe holiday weekend!",
    category: "Holiday",
    date: "2026-06-24",
    time: "09:00 AM",
    author: "Administration"
  },
  {
    id: "ANN-004",
    title: "Important Notice: Ring Rules & Etiquette",
    description: "Friendly reminder that mouthguards are MANDATORY for all sparring sessions, no exceptions. Additionally, please wipe down bags and strength equipment after use. Let's keep the gym clean and safe for everyone.",
    category: "Notice",
    date: "2026-06-25",
    time: "08:00 AM",
    author: "Head Coach"
  }
];

export const initialActivities = [
  { id: "ACT-001", type: "success", text: "Marcus Vance paid monthly fee of $150.", time: "2 hours ago" },
  { id: "ACT-002", type: "info", text: "New Announcement: Ring Rules & Etiquette posted.", time: "5 hours ago" },
  { id: "ACT-003", type: "success", text: "Student Aisha Bello checked in for morning batch.", time: "Today, 08:15 AM" },
  { id: "ACT-004", type: "danger", text: "Automated alert: Carlos Rodriguez payment of $220 is overdue.", time: "1 day ago" },
  { id: "ACT-005", type: "info", text: "Trainer Buster Douglas checked in.", time: "Yesterday, 07:00 AM" }
];
