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
        let userJSON = try await client.sendJSONObject(path: "api/users/me/", token: tokens.access)
        let user = CurrentUser(dictionary: userJSON)
        return (tokens, user)
    }
}
