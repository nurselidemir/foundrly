import SwiftUI

struct AIBuilderView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var selectedOwnedProjectId: Int?

    private var ownedProjects: [ProjectCard] {
        let currentUserId = session.currentUser?.id
        return viewModel.projects.filter { $0.owner.id == currentUserId }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    if session.currentUser?.is_premium == true {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Sana Özel AI Proje Önerileri")
                                .font(.title2.bold())

                            if viewModel.recommendedProjects.isEmpty {
                                Text("Henüz öneri bulunmuyor. Profilini zenginleştirerek daha güçlü eşleşmeler alabilirsin.")
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            } else {
                                ForEach(viewModel.recommendedProjects) { match in
                                    VStack(alignment: .leading, spacing: 10) {
                                        Text(match.project.title)
                                            .font(.headline)
                                        Text(match.ai_summary)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                        Text("%\(Int(match.score)) uyum · \(match.recommended_role ?? "Önerilen rol yok")")
                                            .font(.caption.bold())
                                            .foregroundStyle(FoundrlyTheme.accent)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()

                        VStack(alignment: .leading, spacing: 12) {
                            Text("Projene Aday Bul")
                                .font(.title2.bold())

                            Picker("Proje Seç", selection: $selectedOwnedProjectId) {
                                Text("Proje seç").tag(Optional<Int>.none)
                                ForEach(ownedProjects) { project in
                                    Text(project.title).tag(Optional(project.id))
                                }
                            }
                            .pickerStyle(.menu)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                            Button("AI Analizini Başlat") {
                                guard let selectedOwnedProjectId else { return }
                                Task { await viewModel.runAIMatching(session: session, projectId: selectedOwnedProjectId) }
                            }
                            .fontWeight(.bold)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(FoundrlyTheme.primary)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                            if !viewModel.aiMatches.isEmpty {
                                ForEach(viewModel.aiMatches) { match in
                                    VStack(alignment: .leading, spacing: 10) {
                                        NavigationLink {
                                            PublicProfileView(viewModel: viewModel, userId: match.user.id)
                                        } label: {
                                            Text(match.user.full_name)
                                                .font(.headline)
                                                .foregroundStyle(.white)
                                        }
                                        Text(match.ai_summary)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                        Text("%\(Int(match.score)) uyum · \(match.recommended_role ?? match.user.title)")
                                            .font(.caption.bold())
                                            .foregroundStyle(FoundrlyTheme.accent)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()
                    } else {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("AI Takım Kurucu")
                                .font(.title2.bold())
                            Text("Bu alan premium üyeler için açık. Premium ile AI eşleşmeleri ve proje bazlı aday analizi kullanabilirsin.")
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Button("Premium'a Geç") {
                                Task { await viewModel.activatePremium(session: session, plan: "monthly") }
                            }
                            .fontWeight(.bold)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(FoundrlyTheme.primary)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()
                    }

                    if !viewModel.feedbackMessage.isEmpty {
                        Text(viewModel.feedbackMessage)
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(FoundrlyTheme.accent)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .foundrlyCard()
                    }
                }
                .padding(20)
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .navigationTitle("AI Takım Kurucu")
        }
    }
}
