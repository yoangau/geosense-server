export interface GroupUserAdminDTO extends GroupUserDTO {
  adminId: string;
}

export interface GroupUserDTO {
  userId: string;
  groupId: string;
}
