import { NzUploadFile } from "ng-zorro-antd/upload";

export interface Task {
  id?: number | undefined;
  nome: string;
  descricao: string;
  inicio: string,
  fim?: string | null,
  anexos?: string[],
  usuarioId: number
}

export interface User {
  id: number,
  nome: string;
  telefone: string | null,
  email: string,
  notificationPreference: string
}