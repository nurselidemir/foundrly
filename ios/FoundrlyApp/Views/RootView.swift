import SwiftUI

struct RootView: View {
    @EnvironmentObject private var session: AppSession

    var body: some View {
        Group {
            if session.isAuthenticated {
                AppShellView()
            } else {
                AuthFlowView()
            }
        }
        .background(FoundrlyTheme.background.ignoresSafeArea())
    }
}
