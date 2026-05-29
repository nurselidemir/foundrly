import Foundation
import Combine

@MainActor
final class AppSession: ObservableObject {
    @Published var accessToken: String?
    @Published var refreshToken: String?
    @Published var currentUser: CurrentUser?

    var isAuthenticated: Bool {
        accessToken != nil && currentUser != nil
    }

    var isAdmin: Bool {
        currentUser?.is_staff == true || currentUser?.is_superuser == true
    }

    var isMentor: Bool {
        currentUser?.is_mentor == true
    }

    var isPremium: Bool {
        currentUser?.is_premium == true
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
