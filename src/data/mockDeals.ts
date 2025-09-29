export interface Deal {
  id: string;
  name: string;
  client: string;
  clientId: string;
  status: "active" | "pending" | "completed" | "cancelled";
  phase: string;
  value: number;
  closeDate: string;
  progress: number;
  description: string;
  createdAt: string;
  lastActivity: string;
}

export const mockDeals: Deal[] = [
  {
    id: "deal-1",
    name: "TechCorp Acquisition",
    client: "TechCorp Inc.",
    clientId: "client-1",
    status: "active",
    phase: "Due Diligence",
    value: 25000000,
    closeDate: "2024-06-30",
    progress: 65,
    description: "Acquisition of TechCorp's SaaS division",
    createdAt: "2024-01-15",
    lastActivity: "2024-03-20",
  },
  {
    id: "deal-2",
    name: "Global Pharma Merger",
    client: "MediHealth Global",
    clientId: "client-2",
    status: "active",
    phase: "Negotiation",
    value: 150000000,
    closeDate: "2024-09-15",
    progress: 45,
    description: "Strategic merger with international pharmaceutical company",
    createdAt: "2024-02-01",
    lastActivity: "2024-03-19",
  },
  {
    id: "deal-3",
    name: "RetailChain Buyout",
    client: "RetailChain Ltd.",
    clientId: "client-3",
    status: "pending",
    phase: "Initial Review",
    value: 75000000,
    closeDate: "2024-12-01",
    progress: 20,
    description: "Potential buyout of regional retail chain",
    createdAt: "2024-03-01",
    lastActivity: "2024-03-18",
  },
  {
    id: "deal-4",
    name: "FinTech Partnership",
    client: "FinServe Pro",
    clientId: "client-4",
    status: "active",
    phase: "Documentation",
    value: 42000000,
    closeDate: "2024-07-20",
    progress: 75,
    description: "Strategic partnership and investment in FinTech platform",
    createdAt: "2023-11-10",
    lastActivity: "2024-03-21",
  },
  {
    id: "deal-5",
    name: "Manufacturing Co Sale",
    client: "Industrial Parts Inc.",
    clientId: "client-5",
    status: "completed",
    phase: "Closed",
    value: 89000000,
    closeDate: "2024-02-28",
    progress: 100,
    description: "Sale of manufacturing division completed",
    createdAt: "2023-08-20",
    lastActivity: "2024-02-28",
  },
  {
    id: "deal-6",
    name: "Energy Sector Investment",
    client: "GreenPower Solutions",
    clientId: "client-6",
    status: "active",
    phase: "Valuation",
    value: 120000000,
    closeDate: "2024-10-30",
    progress: 35,
    description: "Investment in renewable energy startup",
    createdAt: "2024-01-20",
    lastActivity: "2024-03-17",
  },
  {
    id: "deal-7",
    name: "Logistics Company Merge",
    client: "FastShip Logistics",
    clientId: "client-7",
    status: "pending",
    phase: "Initial Review",
    value: 55000000,
    closeDate: "2025-01-15",
    progress: 15,
    description: "Merger discussion with regional logistics provider",
    createdAt: "2024-03-10",
    lastActivity: "2024-03-15",
  },
  {
    id: "deal-8",
    name: "SaaS Platform Acquisition",
    client: "CloudData Systems",
    clientId: "client-8",
    status: "active",
    phase: "Due Diligence",
    value: 38000000,
    closeDate: "2024-08-10",
    progress: 55,
    description: "Acquisition of cloud-based data analytics platform",
    createdAt: "2024-01-05",
    lastActivity: "2024-03-20",
  },
];
