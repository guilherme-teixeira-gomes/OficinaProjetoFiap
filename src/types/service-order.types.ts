  export interface AddDiagnosticDTO {
    title: string;
    description: string;
    includeInBudget: boolean;
    serviceIds?: number[];  
    partIds?: number[];    
    priority?: "baixa" | "media" | "alta";  
    mechanicNote?: string;  
  }
  
  export interface CreateServiceOrderDTO {
    client: {
      document: string;
      name?: string;
      email?: string;
      phone?: string;
    };
    vehicle: {
      id?: number;
      plate?: string;
      brand?: string;
      model?: string;
      year?: number;
    };
    observation?: string;
  }