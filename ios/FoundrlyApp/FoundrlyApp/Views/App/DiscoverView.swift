import SwiftUI

struct DiscoverView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var selectedProjectId: Int?
    @State private var applyMessage = ""

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 18) {
                    FoundrlySectionHeader(
                        eyebrow: "Keşfet",
                        title: "Projeleri vitrinde incele",
                        subtitle: "Kurucuların açık çağrılarını, premium öne çıkanlarını ve ekip ihtiyacını daha net gör."
                    )
                    .foundrlyCard()

                    ForEach(viewModel.projects) { project in
                        projectCard(project)
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
            .navigationTitle("Keşfet")
        }
    }

    private func projectCard(_ project: ProjectCard) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(project.title)
                        .font(.title3.bold())
                        .foregroundStyle(FoundrlyTheme.textPrimary)

                    NavigationLink {
                        PublicProfileView(viewModel: viewModel, userId: project.owner.id)
                    } label: {
                        Text("\(project.owner.full_name) · \(project.owner.title)")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(FoundrlyTheme.accent)
                    }
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 8) {
                    FoundrlyPill(
                        title: project.is_premium_highlighted ? "Premium" : "Açık İlan",
                        tint: project.is_premium_highlighted ? FoundrlyTheme.gold.opacity(0.22) : FoundrlyTheme.surfaceSoft,
                        textColor: project.is_premium_highlighted ? FoundrlyTheme.gold : .white
                    )

                    Text(project.created_at.prefix(10))
                        .font(.caption)
                        .foregroundStyle(FoundrlyTheme.textMuted)
                }
            }

            Text(project.summary)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.textSecondary)

            HStack(spacing: 10) {
                detailChip("Hızlı eşleşme")
                detailChip(project.is_premium_highlighted ? "Üst sırada" : "Topluluk akışı")
                detailChip("Mobil başvuru açık")
            }

            if selectedProjectId == project.id {
                VStack(alignment: .leading, spacing: 12) {
                    if let problem = project.problem_statement, !problem.isEmpty {
                        detailBlock("Problem Alanı", problem)
                    }

                    if let roles = project.needed_roles, !roles.isEmpty {
                        tagBlock("Aranan Roller", items: roles)
                    }

                    if let stack = project.tech_stack, !stack.isEmpty {
                        tagBlock("Teknoloji Yığını", items: stack)
                    }

                    Text("Kısa başvuru notu")
                        .font(.headline)

                    TextField("Bu projeye neden uygunsun?", text: $applyMessage, axis: .vertical)
                        .padding()
                        .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                    HStack(spacing: 12) {
                        Button("Başvuruyu Gönder") {
                            Task {
                                await viewModel.apply(session: session, projectId: project.id, message: applyMessage)
                                applyMessage = ""
                                selectedProjectId = nil
                            }
                        }
                        .foundrlyPrimaryButton()

                        Button("Kapat") {
                            selectedProjectId = nil
                            applyMessage = ""
                        }
                        .foundrlySecondaryButton()
                    }
                }
                .foundrlySoftCard()
            } else {
                Button("Detayı Gör ve Başvur") {
                    selectedProjectId = project.id
                }
                .foundrlyPrimaryButton()
            }
        }
        .foundrlyCard()
    }

    private func detailChip(_ text: String) -> some View {
        Text(text)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
            .clipShape(Capsule())
    }

    private func detailBlock(_ title: String, _ body: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.caption.bold())
                .foregroundStyle(FoundrlyTheme.textMuted)
            Text(body)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func tagBlock(_ title: String, items: [String]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.caption.bold())
                .foregroundStyle(FoundrlyTheme.textMuted)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(items, id: \.self) { item in
                        Text(item)
                            .font(.caption.bold())
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(FoundrlyTheme.surface.opacity(0.72))
                            .clipShape(Capsule())
                    }
                }
            }
        }
    }
}
