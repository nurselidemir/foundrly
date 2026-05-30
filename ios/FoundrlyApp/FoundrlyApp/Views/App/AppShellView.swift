import SwiftUI

struct AppShellView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AppShellViewModel()

    var body: some View {
        Group {
            if session.isAdmin {
                TabView(selection: $viewModel.selectedTabTag) {
                    AdminPanelView()
                        .tabItem {
                            Label("Yönetim", systemImage: "shield.fill")
                        }
                        .tag(0)

                    DiscoverView(viewModel: viewModel)
                        .tabItem {
                            Label("Keşfet", systemImage: "sparkle.magnifyingglass")
                        }
                        .tag(1)

                    MessagesView(viewModel: viewModel)
                        .tabItem {
                            Label("Mesajlar", systemImage: "message.fill")
                        }
                        .tag(2)

                    ProfileView(viewModel: viewModel)
                        .tabItem {
                            Label("Profil", systemImage: "person.crop.circle.fill")
                        }
                        .tag(3)
                }
                .tint(FoundrlyTheme.error)
            } else {
                TabView(selection: $viewModel.selectedTabTag) {
                    HomeView(viewModel: viewModel)
                        .tabItem {
                            Label("Ana Sayfa", systemImage: "house.fill")
                        }
                        .tag(0)

                    DiscoverView(viewModel: viewModel)
                        .tabItem {
                            Label("Keşfet", systemImage: "sparkle.magnifyingglass")
                        }
                        .tag(1)

                    CreateProjectView(viewModel: viewModel)
                        .tabItem {
                            Label("Oluştur", systemImage: "plus.circle.fill")
                        }
                        .tag(2)

                    MessagesView(viewModel: viewModel)
                        .tabItem {
                            Label("Mesajlar", systemImage: "message.fill")
                        }
                        .tag(3)

                    ProfileView(viewModel: viewModel)
                        .tabItem {
                            Label("Profil", systemImage: "person.crop.circle.fill")
                        }
                        .tag(4)
                }
                .tint(FoundrlyTheme.primary)
            }
        }
        .task {
            await viewModel.load(session: session)
        }
    }
}
