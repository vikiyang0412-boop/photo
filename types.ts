
export interface GenerationState {
  isGenerating: boolean;
  originalImage: string | null;
  generatedImage: string | null;
  error: string | null;
}

export enum ProfessionalStyle {
  BUSINESS_FORMAL = 'Business Formal',
  SMART_CASUAL = 'Smart Casual',
  CREATIVE_STUDIO = 'Creative Studio'
}
