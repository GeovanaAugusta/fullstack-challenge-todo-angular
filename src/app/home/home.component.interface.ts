export interface Task {
  id?: number | undefined;
  nome: string;
  descricao: string;
  inicio: string,
  fim?: string | null,
  anexos?: [],
  usuarioId: number
}

export interface User {
  id: number,
  nome: string;
  telefone: string | null,
  email: string,
  notificationPreference: string
}