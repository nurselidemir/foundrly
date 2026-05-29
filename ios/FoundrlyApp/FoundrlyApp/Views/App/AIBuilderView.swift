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
            ScrollView(showsIndicators: false) {
                VStack(spacing: 18) {
                    if session.currentUser?.is_premium == true {
                        premiumExperience
                    } else {
                        lockedExperience
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
                .padding(.bottom, 40)
            }
            .foundrlyScreen()
            .navigationTitle("AI Takım Kurucu")
        }
    }

    private var premiumExperience: some View {
        VStack(spacing: 18) {
            VStack(alignment: .leading, spacing: 14) {
                FoundrlySectionHeader(
                    eyebrow: "AI Önerileri",
                    title: "Sana uygun projeler",
                    subtitle: "Web’deki premium keşif mantığını mobilde daha kısa ve karar odaklı bir yapıda sunuyor."
                )

                if viewModel.recommendedProjects.isEmpty {
                    Text("Henüz öneri bulunmuyor. Profil yeteneklerini ve ilgi alanlarını zenginleştirerek daha kaliteli eşleşmeler alabilirsin.")
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                } else {
                    ForEach(viewModel.recommendedProjects) { match in
                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Text(match.project.title)
                                    .font(.headline.bold())
                                Spacer()
                                FoundrlyPill(title: "%\(Int(match.score)) uyum", tint: FoundrlyTheme.accent.opacity(0.18), textColor: FoundrlyTheme.accent)
                            }
                            Text(match.ai_summary)
                                .font(.subheadline)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text(match.recommended_role ?? "Önerilen rol yakında")
                                .font(.caption.bold())
                                .foregroundStyle(FoundrlyTheme.gold)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlySoftCard()
                    }
                }
            }
            .foundrlyCard()

            VStack(alignment: .leading, spacing: 14) {
                FoundrlySectionHeader(
                    eyebrow: "Aday Motoru",
                    title: "Kendi projen için aday bul",
                    subtitle: "Bir proje seç, ardından AI motoru uygun profilleri puanlayıp kısa açıklamalarla sıralasın."
                )

                Picker("Proje Seç", selection: $selectedOwnedProjectId) {
                    Text("Proje seç").tag(Optional<Int>.none)
                    ForEach(ownedProjects) { project in
                        Text(project.title).tag(Optional(project.id))
                    }
                }
                .pickerStyle(.menu)
                .padding()
                .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                Button("AI Analizini Başlat") {
                    guard let selectedOwnedProjectId else { return }
                    Task { await viewModel.runAIMatching(session: session, projectId: selectedOwnedProjectId) }
                }
                .foundrlyPrimaryButton()

                if !viewModel.aiMatches.isEmpty {
                    ForEach(viewModel.aiMatches) { match in
                        VStack(alignment: .leading, spacing: 10) {
                            NavigationLink {
                                PublicProfileView(viewModel: viewModel, userId: match.user.id)
                            } label: {
                                Text(match.user.full_name)
                                    .font(.headline.bold())
                                    .foregroundStyle(.white)
                            }

                            Text(match.ai_summary)
                                .font(.subheadline)
                                .foregroundStyle(FoundrlyTheme.textSecondary)

                            HStack(spacing: 10) {
                                FoundrlyPill(title: "%\(Int(match.score)) uyum", tint: FoundrlyTheme.primary.opacity(0.2))
                                FoundrlyPill(title: match.recommended_role ?? match.user.title, tint: FoundrlyTheme.surfaceSoft)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlySoftCard()
                    }
                }
            }
            .foundrlyCard()
        }
    }

    private var lockedExperience: some View {
        VStack(alignment: .leading, spacing: 16) {
            FoundrlySectionHeader(
                eyebrow: "Premium Alan",
                title: "AI Takım Kurucu kilitli",
                subtitle: "Kilitli ekranı daha profesyonel bir ürün vitrini gibi düzenledim; premium açıldığında öneriler, rol eşleşmeleri ve aday motoru aktif olacak."
            )

            HStack(alignment: .top, spacing: 12) {
                lockedSpot(title: "Proje uyum skoru", body: "Her proje için kişiselleştirilmiş eşleşme yüzdesi.")
                lockedSpot(title: "Aday shortlist", body: "Rol bazlı sıralanmış ve açıklanmış aday seti.")
            }

            Button("Premium'a Geç") {
                Task { await viewModel.activatePremium(session: session, plan: "monthly") }
            }
            .foundrlyPrimaryButton()
        }
        .foundrlyCard()
    }

    private func lockedSpot(title: String, body: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Image(systemName: "lock.shield.fill")
                .font(.title3)
                .foregroundStyle(FoundrlyTheme.gold)
            Text(title)
                .font(.headline.bold())
            Text(body)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, minHeight: 140, alignment: .leading)
        .padding(16)
        .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}
