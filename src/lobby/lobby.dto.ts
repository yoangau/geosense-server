export interface LobbyUserAdminDTO extends LobbyUserDTO {
  adminId: string;
}

export interface LobbyUserDTO {
  userId: string;
  lobbyId: string;
}
