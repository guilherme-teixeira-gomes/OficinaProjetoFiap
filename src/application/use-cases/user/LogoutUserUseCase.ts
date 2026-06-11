
export class LogoutUserUseCase {

  static async logout(userId: number) {
    return { message: "Logout realizado com sucesso" };
  }
}