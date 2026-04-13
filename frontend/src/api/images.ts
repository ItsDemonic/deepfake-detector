import { apiClient } from './client';
import type { DetectionResult } from '../types';

export async function detectImage(file: File): Promise<DetectionResult> {
  const formData = new FormData();
  formData.append('File', file);
  const res = await apiClient.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}
