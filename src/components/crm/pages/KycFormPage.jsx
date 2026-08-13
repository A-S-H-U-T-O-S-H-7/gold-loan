'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Link from 'next/link';
import PageHeader from '@/components/crm/ui/PageHeader';
import { Field, GhostButton, PrimaryButton, inputClass } from '@/components/crm/ui/FormControls';
import { customerService } from '@/lib/services/customerService';
import { useLoanStore } from '@/lib/store/loanStore';
import { KYC_STATUSES } from '@/lib/constants/crm';

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  mobile: Yup.string().required('Mobile is required').matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile'),
  status: Yup.string().required(),
  email: Yup.string().email('Enter a valid email'),
  aadhaar: Yup.string().matches(/^$|^[2-9]\d{11}$/, 'Enter a valid 12-digit Aadhaar'),
  pan: Yup.string().matches(/^$|^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN'),
});

export default function KycFormPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const applications = useLoanStore((s) => s.applications);
  const app = useMemo(() => customerService.getById(id), [applications, id]);
  const customer = app?.customer || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: customer.name || '',
      dob: customer.dob || '',
      gender: customer.gender || '',
      mobile: customer.mobile || '',
      email: customer.email || '',
      address: customer.address || '',
      purpose: customer.purpose || '',
      aadhaar: customer.aadhaar || '',
      pan: customer.pan || '',
      photo: customer.photo || '',
      accountNumber: customer.bankDetails?.accountNumber || '',
      ifsc: customer.bankDetails?.ifsc || '',
      bankName: customer.bankDetails?.bankName || '',
      branch: customer.bankDetails?.branch || '',
      accountType: customer.bankDetails?.accountType || 'Savings',
      holderName: customer.bankDetails?.holderName || customer.name || '',
      status: ['PENDING', 'UNDER_REVIEW', 'FOLLOW_UP', 'KYC_VERIFIED', 'REJECTED'].includes(app?.status)
        ? app.status
        : 'PENDING',
      rejectReason: app?.rejectedReason || '',
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (values.status === 'KYC_VERIFIED' && (!values.aadhaar || !values.pan || !values.accountNumber)) {
        return toast.error('Aadhaar, PAN and bank details are required to mark KYC verified');
      }
      if (values.status === 'REJECTED' && !values.rejectReason) {
        return toast.error('Enter a reject reason');
      }
      customerService.saveKyc(id, toCustomer(values), values.status, values.rejectReason);
      toast.success(`Saved as ${values.status.replaceAll('_', ' ')}`);
      if (values.status === 'FOLLOW_UP') router.push('/crm/follow-up');
      else if (values.status === 'KYC_VERIFIED') router.push('/crm/gold-evaluation');
      else if (values.status === 'REJECTED') router.push('/crm/rejected-applications');
      else router.push('/crm/create-customer');
    },
  });

  if (!app) {
    return <p className="p-6 text-foreground-muted">Application not found.</p>;
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <PageHeader
        title={`KYC verification — ${app.id}`}
        description="Pending → Under review → KYC verified (Gold evaluation). Follow-up if only initial data. Reject if failed."
        action={<Link href="/crm/create-customer" className="text-sm text-primary font-medium">Back to leads</Link>}
      />
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <section className="card p-5">
          <h3 className="mb-4">Status</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Application status">
              <select className={inputClass} {...formik.getFieldProps('status')}>
                {KYC_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
              </select>
            </Field>
            {formik.values.status === 'REJECTED' && (
              <Field label="Reject reason">
                <input className={inputClass} {...formik.getFieldProps('rejectReason')} />
              </Field>
            )}
          </div>
        </section>

        <section className="card p-5">
          <h3 className="mb-4">Personal details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" error={formik.touched.name && formik.errors.name}>
              <input className={inputClass} {...formik.getFieldProps('name')} />
            </Field>
            <Field label="Date of birth">
              <input type="date" className={inputClass} {...formik.getFieldProps('dob')} />
            </Field>
            <Field label="Gender">
              <select className={inputClass} {...formik.getFieldProps('gender')}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>
            <Field label="Mobile" error={formik.touched.mobile && formik.errors.mobile}>
              <input className={inputClass} maxLength={10} {...formik.getFieldProps('mobile')} />
            </Field>
            <Field label="Email" error={formik.touched.email && formik.errors.email}>
              <input className={inputClass} {...formik.getFieldProps('email')} />
            </Field>
            <Field label="Purpose">
              <input className={inputClass} {...formik.getFieldProps('purpose')} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address">
                <input className={inputClass} {...formik.getFieldProps('address')} />
              </Field>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h3 className="mb-4">KYC documents</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Aadhaar" error={formik.touched.aadhaar && formik.errors.aadhaar}>
              <input className={inputClass} maxLength={12} {...formik.getFieldProps('aadhaar')} />
            </Field>
            <Field label="PAN" error={formik.touched.pan && formik.errors.pan}>
              <input className={inputClass} maxLength={10} value={formik.values.pan} onChange={(e) => formik.setFieldValue('pan', e.target.value.toUpperCase())} />
            </Field>
            <Field label="Photo">
              <input type="file" accept="image/*" className={inputClass} onChange={(e) => formik.setFieldValue('photo', e.target.files?.[0]?.name || '')} />
            </Field>
          </div>
        </section>

        <section className="card p-5">
          <h3 className="mb-4">Bank details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Account number"><input className={inputClass} {...formik.getFieldProps('accountNumber')} /></Field>
            <Field label="IFSC"><input className={inputClass} value={formik.values.ifsc} onChange={(e) => formik.setFieldValue('ifsc', e.target.value.toUpperCase())} /></Field>
            <Field label="Bank name"><input className={inputClass} {...formik.getFieldProps('bankName')} /></Field>
            <Field label="Branch"><input className={inputClass} {...formik.getFieldProps('branch')} /></Field>
            <Field label="Account type">
              <select className={inputClass} {...formik.getFieldProps('accountType')}>
                <option>Savings</option>
                <option>Current</option>
              </select>
            </Field>
            <Field label="Account holder"><input className={inputClass} {...formik.getFieldProps('holderName')} /></Field>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <GhostButton onClick={() => router.back()}>Cancel</GhostButton>
          <PrimaryButton type="submit" onClick={formik.handleSubmit}>Save KYC</PrimaryButton>
        </div>
      </form>
    </div>
  );
}

function toCustomer(values) {
  return {
    name: values.name,
    dob: values.dob,
    gender: values.gender,
    mobile: values.mobile,
    email: values.email,
    address: values.address,
    purpose: values.purpose,
    aadhaar: values.aadhaar,
    pan: values.pan,
    photo: values.photo,
    bankDetails: {
      accountNumber: values.accountNumber,
      ifsc: values.ifsc,
      bankName: values.bankName,
      branch: values.branch,
      accountType: values.accountType,
      holderName: values.holderName || values.name,
    },
  };
}
