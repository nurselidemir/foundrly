import SwiftUI

struct AppShellView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AppShellViewModel()

    var body: some View {
        TabView {
            HomeView(viewModel: viewModel)
                .tabItem {
                    Label("Ana Sayfa", systemImage: "house.fill")
                }

            DiscoverView(viewModel: viewModel)
                .tabItem {
                    Label("Keşfet", systemImage: "sparkles.rectangle.stack.fill")
                }

            MessagesView(viewModel: viewModel)
                .tabItem {
                    Label("Mesajlar", systemImage: "message.fill")
                }

            AIBuilderView(viewModel: viewModel)
                .tabItem {
                    Label("AI", systemImage: "sparkles")
                }

            MentorsView(viewModel: viewModel)
                .tabItem {
                    Label("Mentörler", systemImage: "person.3.fill")
                }

            CommunityView()
                .tabItem {
                    Label("Topluluk", systemImage: "bubble.left.and.bubble.right.fill")
                }

            ProfileView(viewModel: viewModel)
                .tabItem {
                    Label("Profilim", systemImage: "person.crop.circle.fill")
                }
        }
        .tint(FoundrlyTheme.primary)
        .task {
            await viewModel.load(session: session)
        }
    }
}
