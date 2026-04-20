// utils/goldEvaluationSchema.js
import * as Yup from 'yup';

export const goldItemSchema = Yup.object({
  itemType: Yup.string().required('Item type is required'),
  purity: Yup.string().required('Purity is required'),
  grossWeight: Yup.number()
    .required('Gross weight is required')
    .positive('Gross weight must be positive')
    .max(1000, 'Gross weight cannot exceed 1000g'),
  netWeight: Yup.number()
    .required('Net weight is required')
    .positive('Net weight must be positive')
    .max(1000, 'Net weight cannot exceed 1000g')
    .test('net-weight-less-than-gross', 'Net weight cannot exceed gross weight', function(value) {
      const { grossWeight } = this.parent;
      if (!grossWeight || !value) return true;
      return value <= grossWeight;
    }),
  stoneWeight: Yup.number()
    .min(0, 'Stone weight cannot be negative')
    .max(500, 'Stone weight cannot exceed 500g'),
  description: Yup.string().max(500, 'Description cannot exceed 500 characters'),
  image: Yup.mixed().nullable()
});

export const goldEvaluationSchema = Yup.object({
  gold_items: Yup.array()
    .min(1, 'At least one gold item is required')
    .of(goldItemSchema),
  gold_rate: Yup.number()
    .required('Gold rate is required')
    .positive('Gold rate must be positive'),
  ltv_percentage: Yup.number()
    .required('LTV percentage is required')
    .min(50, 'LTV percentage cannot be less than 50%')
    .max(90, 'LTV percentage cannot exceed 90%')
});