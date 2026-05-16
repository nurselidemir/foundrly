import Foundation

struct AuthService {
    private let client = APIClient()

    func register(request: RegisterRequest) async throws -> CurrentUser {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/auth/register/", method: "POST", body: body)
    }

    func login(request: LoginRequest) async throws -> (TokenResponse, CurrentUser) {
        let body = try JSONEncoder().encode(request)
        let tokens: TokenResponse = try await client.send(path: "api/auth/token/", method: "POST", body: body)
        let user: CurrentUser = try await client.send(path: "api/users/me/", token: tokens.access)
        return (tokens, user)
    }
}
