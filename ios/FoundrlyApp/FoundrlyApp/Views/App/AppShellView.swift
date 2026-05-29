import SwiftUI

struct AppShellView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var viewModel = AppShellViewModel()

    var body: some View {
        Group {
            if session.isAdmin {
                TabView {
                    AdminPanelView()
                        .tabItem {
                            Label("Yönetim", systemImage: "shield.fill")
                        }

                    DiscoverView(viewModel: viewModel)
                        .tabItem {
                            Label("Keşfet", systemImage: "sparkle.magnifyingglass")
                        }

                    MessagesView(viewModel: viewModel)
                        .tabItem {
                            Label("Mesajlar", systemImage: "message.fill")
                        }

                    ProfileView(viewModel: viewModel)
                        .tabItem {
                            Label("Profil", systemImage: "person.crop.circle.fill")
                        }
                }
                .tint(FoundrlyTheme.error)
            } else if session.isMentor {
                TabView {
                    MentorsView(viewModel: viewModel)
                        .tabItem {
                            Label("Mentörlük", systemImage: "signature")
                        }

                    DiscoverView(viewModel: viewModel)
                        .tabItem {
                            Label("Keşfet", systemImage: "sparkle.magnifyingglass")
                        }

                    MessagesView(viewModel: viewModel)
                        .tabItem {
                            Label("Mesajlar", systemImage: "message.fill")
                        }

                    ProfileView(viewModel: viewModel)
                        .tabItem {
                            Label("Profil", systemImage: "person.crop.circle.fill")
                        }
                }
                .tint(FoundrlyTheme.success)
            } else {
                TabView {
                    HomeView(viewModel: viewModel)
                        .tabItem {
                            Label("Ana Sayfa", systemImage: "house.fill")
                        }

                    DiscoverView(viewModel: viewModel)
                        .tabItem {
                            Label("Keşfet", systemImage: "sparkle.magnifyingglass")
                        }

                    CreateProjectView(viewModel: viewModel)
                        .tabItem {
                            Label("Oluştur", systemImage: "plus.circle.fill")
                        }

                    MessagesView(viewModel: viewModel)
                        .tabItem {
                            Label("Mesajlar", systemImage: "message.fill")
                        }

                    ProfileView(viewModel: viewModel)
                        .tabItem {
                            Label("Profil", systemImage: "person.crop.circle.fill")
                        }
                }
                .tint(FoundrlyTheme.primary)
            }
        }
        .task {
            await viewModel.load(session: session)
        }
    }
}
