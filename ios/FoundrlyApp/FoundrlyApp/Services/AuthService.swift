import Foundation

struct AuthService {
    private let client = APIClient()

    func register(request: RegisterRequest) async throws -> CurrentUser {
        let body = try JSONEncoder().encode(request)
        return try await client.send(path: "api/auth/register/", method: "POST", body: body)
    }

    func login(request: LoginRequest) async throws -> (TokenResponse, CurrentUser) {
        let body = try JSONEncoder().encode(request)
        let tokenJSON = try await client.sendJSONObject(path: "api/auth/token/", method: "POST", body: body)
        guard
            let access = tokenJSON["access"] as? String,
            let refresh = tokenJSON["refresh"] as? String
        else {
            throw APIError.server("Giriş yanıtında oturum bilgileri eksik.")
        }

        let tokens = TokenResponse(access: access, refresh: refresh)
        let userJSON = try await client.sendJSONObject(path: "api/users/me/", token: tokens.access)
        let user = CurrentUser(dictionary: userJSON)
        return (tokens, user)
    }
}
