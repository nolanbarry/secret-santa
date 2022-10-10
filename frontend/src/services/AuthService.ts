class AuthService {
    // TODO: IMPLEMENT API ACCESS
//   getAll() {
//     return http.get("/tutorials");
//   }
    private isLoggedIn = false;

    getAuth() {
        return this.isLoggedIn;
    }

    login() {
        this.isLoggedIn = true;
    }
}

export default new AuthService();