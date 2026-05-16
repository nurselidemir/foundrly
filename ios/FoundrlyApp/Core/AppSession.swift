import Foundation

@MainActor
final class AppSession: ObservableObject {
    @Published var accessToken: String?
    @Published var refreshToken: String?
    @Published var currentUser: CurrentUser?

    var isAuthenticated: Bool {
        accessToken != nil && currentUser != nil
    }

    func updateSession(accessToken: String, refreshToken: String, user: CurrentUser) {
        self.accessToken = accessToken
        self.refreshToken = refreshToken
        self.currentUser = user
    }

    func clear() {
        accessToken = nil
        refreshToken = nil
        currentUser = nil
    }
}
