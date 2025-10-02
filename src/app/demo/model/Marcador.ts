
//MODEL ORIGINAL
export interface Marcador {
    marcadorProveedorCod: string; // Código del proveedor del marcador
    marcadorProveedorDesc: string; // Descripción del proveedor del marcador
    marcadorProveedorIp: string; // Dirección IP del proveedor
    real_ip: string; // Dirección IP real
    marcadorClienteCod: string; // Código del cliente del marcador
    marcadorDesc: string; // Descripción del marcador
    marcadorEstado: string; // Estado del marcador
    marcadorEstadoDesc: string; // Descripción del estado del marcador
    sn:string;
}

//MODEL DE CAMPOS A MODIFICAR
export interface Marcador_ins {
    marcadorClienteCod: string; // Código del cliente del marcador
    marcadorProveedorCod: string; // Código del proveedor del marcador
    marcadorDesc: string; // Descripción del marcador
    marcadorEstado: string; // Estado del marcador
}
