export interface CreateFullServiceOrderDTO {

    client: {
      name: string;
      document: string;
      email: string;
      phone: string;
      address?: string;
    };

    vehicle: {
      plate: string;
      brand: string;
      model: string;
      year: number;
      color?: string;
    };
    
    observation?: string;
  }
  
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
    clientDocument: string;
    vehicle: {
      plate: string;
      brand: string;
      model: string;
      year: number;
    };
    services: number[];
    parts: number[];
  }