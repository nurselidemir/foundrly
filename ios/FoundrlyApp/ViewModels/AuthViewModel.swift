import Foundation

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var fullName = ""
    @Published var title = ""
    @Published var bio = ""
    @Published var skills = ""
    @Published var interests = ""
    @Published var errorMessage = ""
    @Published var isLoading = false

    private let service = AuthService()

    func login(session: AppSession) async {
        isLoading = true
        defer { isLoading = false }

        do {
            let (tokens, user) = try await service.login(
                request: LoginRequest(email: email, password: password)
            )
            session.updateSession(accessToken: tokens.access, refreshToken: tokens.refresh, user: user)
            errorMessage = ""
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func register(session: AppSession) async {
        isLoading = true
        defer { isLoading = false }

        do {
            _ = try await service.register(
                request: RegisterRequest(
                    email: email,
                    password: password,
                    full_name: fullName,
                    title: title,
                    bio: bio,
                    skills: skills.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) },
                    interests: interests.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                )
            )
            await login(session: session)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
