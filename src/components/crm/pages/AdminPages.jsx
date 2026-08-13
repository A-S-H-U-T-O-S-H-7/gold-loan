'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import Modal from '@/components/crm/ui/Modal';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import { Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { PERMISSION_KEYS } from '@/lib/constants/crm';
import { useLoanStore } from '@/lib/store/loanStore';

export function BranchManagementPage() {
  const branches = useLoanStore((s) => s.branches);
  const addBranch = useLoanStore((s) => s.addBranch);
  const updateBranch = useLoanStore((s) => s.updateBranch);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', code: '' });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Branch management"
        action={<PrimaryButton onClick={() => setOpen(true)}>Add branch</PrimaryButton>}
      />
      <DataTable
        columns={[
          { key: 'code', label: 'Code' },
          { key: 'name', label: 'Name' },
          { key: 'city', label: 'City' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status === 'Active' ? 'ACTIVE' : 'CLOSED'} /> },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <GhostButton
                className="h-8 px-3 text-xs"
                onClick={() => updateBranch(r.id, { status: r.status === 'Active' ? 'Inactive' : 'Active' })}
              >
                Toggle
              </GhostButton>
            ),
          },
        ]}
        data={branches}
      />
      <Modal
        open={open}
        title="New branch"
        onClose={() => setOpen(false)}
        footer={
          <>
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton
              onClick={() => {
                if (!form.name) return toast.error('Name required');
                addBranch(form);
                toast.success('Branch added');
                setOpen(false);
                setForm({ name: '', city: '', code: '' });
              }}
            >
              Save
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="City"><input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
          <Field label="Code"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}

export function UserRolesPage() {
  const roles = useLoanStore((s) => s.roles);
  const updateRole = useLoanStore((s) => s.updateRole);
  const [selected, setSelected] = useState(null);

  return (
    <div className="animate-fade-in">
      <PageHeader title="User roles" description="Permission keys per role" />
      <DataTable
        columns={[
          { key: 'name', label: 'Role' },
          { key: 'users', label: 'Users' },
          { key: 'permissions', label: 'Permissions', render: (r) => r.permissions?.length || 0 },
          {
            key: 'actions',
            label: 'Actions',
            render: (r) => (
              <GhostButton className="h-8 px-3 text-xs" onClick={() => setSelected(r)}>
                Edit
              </GhostButton>
            ),
          },
        ]}
        data={roles}
      />
      <Modal
        open={!!selected}
        title={selected?.name}
        onClose={() => setSelected(null)}
        wide
        footer={
          <PrimaryButton
            onClick={() => {
              updateRole(selected.id, { permissions: selected.permissions });
              toast.success('Role updated');
              setSelected(null);
            }}
          >
            Save
          </PrimaryButton>
        }
      >
        <div className="grid sm:grid-cols-2 gap-2">
          {PERMISSION_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 text-sm p-2 rounded-lg border border-border">
              <input
                type="checkbox"
                checked={selected?.permissions?.includes(key)}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...(selected.permissions || []), key]
                    : selected.permissions.filter((p) => p !== key);
                  setSelected({ ...selected, permissions: next });
                }}
              />
              {key}
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export function SystemConfigPage() {
  const config = useLoanStore((s) => s.config);
  const updateConfig = useLoanStore((s) => s.updateConfig);
  const resetDemoData = useLoanStore((s) => s.resetDemoData);
  const [form, setForm] = useState(config);

  return (
    <div className="animate-fade-in max-w-xl">
      <PageHeader title="System config" description="Company, interest defaults and NPA threshold" />
      <div className="card p-5 space-y-4">
        <Field label="Company name">
          <input className={inputClass} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        </Field>
        <Field label="Support email">
          <input className={inputClass} value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
        </Field>
        <Field label="Default interest rate">
          <input type="number" className={inputClass} value={form.interestRate} onChange={(e) => setForm({ ...form, interestRate: Number(e.target.value) })} />
        </Field>
        <Field label="Processing fee %">
          <input type="number" className={inputClass} value={form.processingFee} onChange={(e) => setForm({ ...form, processingFee: Number(e.target.value) })} />
        </Field>
        <Field label="NPA after (days)">
          <input type="number" className={inputClass} value={form.npaDays} onChange={(e) => setForm({ ...form, npaDays: Number(e.target.value) })} />
        </Field>
        <Field label="Grace period (days)">
          <input type="number" className={inputClass} value={form.graceDays ?? 7} onChange={(e) => setForm({ ...form, graceDays: Number(e.target.value) })} />
        </Field>
        <Field label="Penalty % per 30 overdue days">
          <input type="number" className={inputClass} value={form.penaltyRate ?? 2} onChange={(e) => setForm({ ...form, penaltyRate: Number(e.target.value) })} />
        </Field>
        <div className="flex gap-2">
          <PrimaryButton
            onClick={() => {
              updateConfig(form);
              toast.success('Config saved');
            }}
          >
            Save
          </PrimaryButton>
          <GhostButton
            onClick={() => {
              resetDemoData();
              toast.success('Demo data reset');
            }}
          >
            Reset demo data
          </GhostButton>
        </div>
      </div>
    </div>
  );
}

export function UserManagementPage() {
  const users = useLoanStore((s) => s.users);
  const roles = useLoanStore((s) => s.roles);
  const branches = useLoanStore((s) => s.branches);
  const addUser = useLoanStore((s) => s.addUser);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'Branch Manager', branchId: 1 });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="User management"
        action={<PrimaryButton onClick={() => setOpen(true)}>Add user</PrimaryButton>}
      />
      <DataTable
        columns={[
          { key: 'id', label: 'ID', render: (r) => <span className="font-mono">{r.id}</span> },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'branchId', label: 'Branch' },
          { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status === 'Active' ? 'ACTIVE' : 'CLOSED'} /> },
        ]}
        data={users}
      />
      <Modal
        open={open}
        title="New user"
        onClose={() => setOpen(false)}
        footer={
          <>
            <GhostButton onClick={() => setOpen(false)}>Cancel</GhostButton>
            <PrimaryButton
              onClick={() => {
                addUser({ ...form, branchId: Number(form.branchId) });
                toast.success('User added');
                setOpen(false);
              }}
            >
              Save
            </PrimaryButton>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email"><input className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Role">
            <select className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map((r) => <option key={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <Field label="Branch">
            <select className={inputClass} value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })}>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
