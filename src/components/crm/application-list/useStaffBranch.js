'use client';

import { useEffect, useState } from 'react';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { getCrmBranches } from '@/lib/services/branchService';

export default function useStaffBranch() {
  const user = useAdminAuthStore((state) => state.user);
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    let active = true;
    getCrmBranches().then((rows) => {
      if (active) setBranches(rows);
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  const id = String(user?.branchId ?? user?.branch_id ?? '');
  return branches.find((branch) => String(branch.id) === id) || null;
}
