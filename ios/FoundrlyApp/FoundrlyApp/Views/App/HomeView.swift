import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var projectTitle = ""
    @State private var projectSummary = ""
    @State private var projectProblem = ""
    @State private var techStack = ""
    @State private var roles = ""

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 18) {
                    if let summary = viewModel.summary {
                        hero(summary: summary)

                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                            metricCard("Projeler", "\(summary.metrics.owned_projects_count)", "Ürün vitrinin")
                            metricCard("Başvurular", "\(summary.metrics.received_applications_count)", "Yeni sinyaller")
                            metricCard("Bekleyen", "\(summary.metrics.pending_received_applications_count)", "Geri dönüş bekliyor")
                            metricCard("Kabul", "\(summary.metrics.accepted_received_applications_count)", "Takıma katılanlar")
                        }

                        quickCreate

                        if !summary.recent_projects.isEmpty {
                            recentProjects(summary.recent_projects)
                        }
                    }

                    if !viewModel.receivedApplications.isEmpty {
                        incomingApplications
                    }

                    if !pendingFriendRequests.isEmpty {
                        friendRequestsPanel
                    }

                    if !viewModel.sentApplications.isEmpty {
                        outgoingApplications
                    }

                    if !viewModel.recommendedProjects.isEmpty {
                        recommendedProjects
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
            .navigationTitle("Foundrly")
        }
    }

    private var pendingFriendRequests: [FriendRequestSummary] {
        let currentUserId = session.currentUser?.id
        return viewModel.friendRequests.filter { $0.status == "pending" && $0.receiver == currentUserId }
    }

    private func hero(summary: DashboardSummary) -> some View {
        VStack(alignment: .leading, spacing: 18) {
            FoundrlySectionHeader(
                eyebrow: "Panel",
                title: "Hoş geldin, \(summary.profile.full_name)",
                subtitle: "Bugün ekibini büyütmek, doğru başvuruları filtrelemek ve yeni fırsatları yönetmek için hazırsın."
            )

            HStack(alignment: .top, spacing: 12) {
                heroSpotlight(
                    title: summary.profile.is_premium ? "Premium görünürlük açık" : "Premium kilitli",
                    body: summary.profile.is_premium
                        ? "AI eşleşmelerin ve gelişmiş keşif alanların aktif."
                        : "Daha iyi keşif ve AI eşleşmeleri için premium'a geç."
                )

                heroSpotlight(
                    title: summary.profile.is_verified_talent ? "Doğrulanmış yetenek" : "Profil sinyali artmalı",
                    body: summary.profile.is_verified_talent
                        ? "Rozetin aktif. Topluluk içinde daha güçlü görünüyorsun."
                        : "Biyografi, yetenek ve proje geçmişini güçlendir."
                )
            }
        }
        .foundrlyCard()
    }

    private func heroSpotlight(title: String, body: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.headline.bold())
                .foregroundStyle(FoundrlyTheme.textPrimary)
            Text(body)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(FoundrlyTheme.surfaceSoft.opacity(0.9))
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
    }

    private func metricCard(_ title: String, _ value: String, _ caption: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title.uppercased())
                .font(.caption.weight(.bold))
                .tracking(1)
                .foregroundStyle(FoundrlyTheme.textMuted)
            Text(value)
                .font(.system(size: 30, weight: .black, design: .rounded))
                .foregroundStyle(FoundrlyTheme.textPrimary)
            Text(caption)
                .font(.caption)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, minHeight: 138, alignment: .leading)
        .foundrlyCard()
    }

    private var quickCreate: some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "Hızlı Başlangıç",
                title: "Yeni proje vitrini aç",
                subtitle: "Kurucu, geliştirici ve tasarımcıları tek karttan etkileyecek kısa ama güçlü bir ilan oluştur."
            )

            Group {
                field("Proje başlığı", text: $projectTitle)
                field("Kısa özet", text: $projectSummary)
                field("Problem tanımı", text: $projectProblem)
                field("Teknolojiler", text: $techStack)
                field("Aranan roller", text: $roles)
            }

            Button("Projeyi Oluştur") {
                Task {
                    await viewModel.createProject(
                        session: session,
                        request: CreateProjectRequest(
                            title: projectTitle,
                            summary: projectSummary,
                            problem_statement: projectProblem,
                            tech_stack: splitTags(techStack),
                            needed_roles: splitTags(roles)
                        )
                    )
                    projectTitle = ""
                    projectSummary = ""
                    projectProblem = ""
                    techStack = ""
                    roles = ""
                }
            }
            .foundrlyPrimaryButton()
        }
        .foundrlyCard()
    }

    private func recentProjects(_ projects: [ProjectCard]) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "Aktif Alan",
                title: "Son projelerin",
                subtitle: "Topluluk önünde açık olan ürün kartların ve görünürlük statüleri burada."
            )

            ForEach(projects.prefix(3)) { project in
                VStack(alignment: .leading, spacing: 10) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(project.title)
                                .font(.headline.bold())
                            Text(project.summary)
                                .font(.subheadline)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .lineLimit(3)
                        }
                        Spacer()
                        FoundrlyPill(
                            title: project.is_premium_highlighted ? "Premium" : "Standart",
                            tint: project.is_premium_highlighted ? FoundrlyTheme.gold.opacity(0.22) : FoundrlyTheme.surfaceSoft,
                            textColor: project.is_premium_highlighted ? FoundrlyTheme.gold : .white
                        )
                    }

                    Text("Son güncelleme: \(project.updated_at.prefix(10))")
                        .font(.caption)
                        .foregroundStyle(FoundrlyTheme.textMuted)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .foundrlySoftCard()
            }
        }
        .foundrlyCard()
    }

    private var incomingApplications: some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "Aday Akışı",
                title: "Yeni başvurular",
                subtitle: "En sıcak adayları hızlıca inceleyip ekibine dahil et."
            )

            ForEach(viewModel.receivedApplications.prefix(4)) { application in
                VStack(alignment: .leading, spacing: 12) {
                    NavigationLink {
                        PublicProfileView(viewModel: viewModel, userId: application.applicant.id)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(application.applicant.full_name)
                                .font(.headline.bold())
                                .foregroundStyle(.white)
                            Text(application.applicant.title)
                                .font(.subheadline)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        }
                    }

                    Text(application.message)
                        .font(.subheadline)
                        .foregroundStyle(FoundrlyTheme.textSecondary)

                    if application.status == "pending" {
                        HStack(spacing: 12) {
                            Button("Kabul Et") {
                                Task {
                                    await viewModel.updateApplicationStatus(
                                        session: session,
                                        applicationId: application.id,
                                        status: "accepted"
                                    )
                                }
                            }
                            .foundrlyPrimaryButton()

                            Button("Reddet") {
                                Task {
                                    await viewModel.updateApplicationStatus(
                                        session: session,
                                        applicationId: application.id,
                                        status: "rejected"
                                    )
                                }
                            }
                            .foundrlySecondaryButton()
                        }
                    } else {
                        FoundrlyPill(
                            title: application.status == "accepted" ? "Kabul edildi" : "Reddedildi",
                            tint: application.status == "accepted" ? FoundrlyTheme.accent.opacity(0.18) : FoundrlyTheme.danger.opacity(0.18),
                            textColor: application.status == "accepted" ? FoundrlyTheme.accent : FoundrlyTheme.danger
                        )
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .foundrlySoftCard()
            }
        }
        .foundrlyCard()
    }

    private var friendRequestsPanel: some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "Bağlantılar",
                title: "Seni bekleyen ağ istekleri",
                subtitle: "Web panelindeki gibi yeni bağlantıları hızla kabul edip topluluk erişimini büyütebilirsin."
            )

            ForEach(pendingFriendRequests) { request in
                VStack(alignment: .leading, spacing: 12) {
                    Text(request.sender_name)
                        .font(.headline.bold())
                    Text("Seninle ağ kurmak istiyor. Kabul ettiğinde mobil topluluk yüzeyinde daha kolay tekrar karşılaşacaksınız.")
                        .font(.subheadline)
                        .foregroundStyle(FoundrlyTheme.textSecondary)

                    HStack(spacing: 12) {
                        Button("Kabul Et") {
                            Task {
                                await viewModel.updateFriendRequest(session: session, requestId: request.id, status: "accepted")
                            }
                        }
                        .foundrlyPrimaryButton()

                        Button("Reddet") {
                            Task {
                                await viewModel.updateFriendRequest(session: session, requestId: request.id, status: "rejected")
                            }
                        }
                        .foundrlySecondaryButton()
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .foundrlySoftCard()
            }
        }
        .foundrlyCard()
    }

    private var outgoingApplications: some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "Gönderdiğin Başvurular",
                title: "Takip etmen gereken fırsatlar",
                subtitle: "Web’deki gönderilen başvuru mantığını mobilde görünür hale getirdim; hangi projelerde sırada olduğunu tek bakışta görebilirsin."
            )

            ForEach(viewModel.sentApplications.prefix(4)) { application in
                VStack(alignment: .leading, spacing: 10) {
                    Text("Proje #\(application.project)")
                        .font(.headline.bold())
                    Text(application.message)
                        .font(.subheadline)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                    FoundrlyPill(
                        title: statusLabel(for: application.status),
                        tint: statusTint(for: application.status),
                        textColor: statusTextColor(for: application.status)
                    )
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .foundrlySoftCard()
            }
        }
        .foundrlyCard()
    }

    private var recommendedProjects: some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "AI Önerileri",
                title: "Sana özel proje sinyalleri",
                subtitle: "Premium kullanıcılara web’de gösterilen uyum bazlı önerileri ana mobil paneline de taşıdım."
            )

            ForEach(viewModel.recommendedProjects.prefix(3)) { match in
                VStack(alignment: .leading, spacing: 10) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text(match.project.title)
                                .font(.headline.bold())
                            Text(match.project.owner.full_name)
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(FoundrlyTheme.accent)
                        }
                        Spacer()
                        FoundrlyPill(
                            title: "%\(Int(match.score)) uyum",
                            tint: FoundrlyTheme.accent.opacity(0.18),
                            textColor: FoundrlyTheme.accent
                        )
                    }

                    Text(match.ai_summary)
                        .font(.subheadline)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .foundrlySoftCard()
            }
        }
        .foundrlyCard()
    }

    private func field(_ title: String, text: Binding<String>) -> some View {
        TextField(title, text: text, axis: .vertical)
            .padding()
            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private func splitTags(_ text: String) -> [String] {
        text
            .split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
    }

    private func statusLabel(for status: String) -> String {
        switch status {
        case "accepted":
            return "Kabul edildi"
        case "rejected":
            return "Reddedildi"
        default:
            return "Beklemede"
        }
    }

    private func statusTint(for status: String) -> Color {
        switch status {
        case "accepted":
            return FoundrlyTheme.accent.opacity(0.18)
        case "rejected":
            return FoundrlyTheme.danger.opacity(0.18)
        default:
            return FoundrlyTheme.gold.opacity(0.18)
        }
    }

    private func statusTextColor(for status: String) -> Color {
        switch status {
        case "accepted":
            return FoundrlyTheme.accent
        case "rejected":
            return FoundrlyTheme.danger
        default:
            return FoundrlyTheme.gold
        }
    }
}
