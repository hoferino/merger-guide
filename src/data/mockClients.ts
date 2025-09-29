export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "active" | "inactive";
  deals: string[];
  lastActive: string;
  phone?: string;
  avatar?: string;
}

export const mockClients: Client[] = [
  {
    id: "client-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    company: "TechCorp Inc.",
    status: "active",
    deals: ["deal-1"],
    lastActive: "2024-03-20",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "client-2",
    name: "Michael Chen",
    email: "m.chen@medihealth.com",
    company: "MediHealth Global",
    status: "active",
    deals: ["deal-2"],
    lastActive: "2024-03-19",
    phone: "+1 (555) 234-5678",
  },
  {
    id: "client-3",
    name: "Emily Rodriguez",
    email: "e.rodriguez@retailchain.com",
    company: "RetailChain Ltd.",
    status: "active",
    deals: ["deal-3"],
    lastActive: "2024-03-18",
    phone: "+1 (555) 345-6789",
  },
  {
    id: "client-4",
    name: "David Park",
    email: "david.park@finserve.com",
    company: "FinServe Pro",
    status: "active",
    deals: ["deal-4"],
    lastActive: "2024-03-21",
    phone: "+1 (555) 456-7890",
  },
  {
    id: "client-5",
    name: "Lisa Anderson",
    email: "l.anderson@industrialparts.com",
    company: "Industrial Parts Inc.",
    status: "active",
    deals: ["deal-5"],
    lastActive: "2024-02-28",
    phone: "+1 (555) 567-8901",
  },
  {
    id: "client-6",
    name: "Robert Kim",
    email: "r.kim@greenpower.com",
    company: "GreenPower Solutions",
    status: "active",
    deals: ["deal-6"],
    lastActive: "2024-03-17",
    phone: "+1 (555) 678-9012",
  },
  {
    id: "client-7",
    name: "Jennifer Lee",
    email: "j.lee@fastship.com",
    company: "FastShip Logistics",
    status: "active",
    deals: ["deal-7"],
    lastActive: "2024-03-15",
    phone: "+1 (555) 789-0123",
  },
  {
    id: "client-8",
    name: "Thomas Wilson",
    email: "t.wilson@clouddata.com",
    company: "CloudData Systems",
    status: "active",
    deals: ["deal-8"],
    lastActive: "2024-03-20",
    phone: "+1 (555) 890-1234",
  },
];
