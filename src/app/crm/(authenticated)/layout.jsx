"use client";
import AdminLayout from "@/components/crm/AdminLayout";

export default function CRMLayout({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
