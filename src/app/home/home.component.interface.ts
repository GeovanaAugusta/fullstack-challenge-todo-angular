export interface Task {
  id?: number | undefined;
  nome: string;
  descricao: string;
  inicio: string,
  fim?: string | null,
  anexos?: [],
  usuarioId: number
}