import SwiftUI

struct DiscoverView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var selectedProjectId: Int?
    @State private var applyMessage = ""

    var discoverProjects: [ProjectCard] {
        viewModel.projects.filter { $0.owner.id != session.currentUser?.id }
    }

    func existingApplication(for projectId: Int) -> TeamApplication? {
        viewModel.sentApplications.first(where: { $0.project == projectId })
    }

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()

                ScrollView {
                    VStack(spacing: 16) {
                        if discoverProjects.isEmpty {
                            VStack(spacing: 12) {
                                Image(systemName: "sparkles")
                                    .font(.system(size: 48))
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                Text("Keşfedilecek Proje Yok")
                                    .font(.headline)
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                Text("Şu an başvurabileceğiniz aktif proje bulunmuyor. Daha sonra tekrar kontrol edin.")
                                    .font(.footnote)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .multilineTextAlignment(.center)
                            }
                            .padding(40)
                            .frame(maxWidth: .infinity)
                            .foundrlyCard()
                        } else {
                            ForEach(discoverProjects) { project in
                                VStack(alignment: .leading, spacing: 12) {
                                    HStack {
                                        VStack(alignment: .leading, spacing: 4) {
                                            NavigationLink {
                                                ProjectDetailView(project: project, viewModel: viewModel)
                                            } label: {
                                                Text(project.title)
                                                    .font(.title3.bold())
                                                    .foregroundStyle(.white)
                                                    .multilineTextAlignment(.leading)
                                            }

                                            NavigationLink {
                                                PublicProfileView(viewModel: viewModel, userId: project.owner.id)
                                            } label: {
                                                Text(project.owner.full_name + " · " + project.owner.title)
                                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                                    .font(.caption)
                                            }
                                        }

                                        Spacer()

                                        if project.is_premium_highlighted {
                                            Text("PREMIUM")
                                                .font(.system(size: 8, weight: .bold))
                                                .foregroundStyle(.black)
                                                .padding(.horizontal, 8)
                                                .padding(.vertical, 4)
                                                .background(FoundrlyTheme.accent)
                                                .clipShape(Capsule())
                                        }
                                    }

                                    Text(project.summary)
                                        .font(.subheadline)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        .lineLimit(3)

                                    if let stack = project.tech_stack, !stack.isEmpty {
                                        ScrollView(.horizontal, showsIndicators: false) {
                                            HStack(spacing: 8) {
                                                ForEach(stack, id: \.self) { tech in
                                                    Text(tech)
                                                        .font(.system(size: 8, weight: .bold))
                                                        .foregroundStyle(FoundrlyTheme.primary)
                                                        .padding(.horizontal, 8)
                                                        .padding(.vertical, 4)
                                                        .background(FoundrlyTheme.primary.opacity(0.12))
                                                        .clipShape(Capsule())
                                                }
                                            }
                                        }
                                    }

                                    if selectedProjectId == project.id {
                                        TextField("Bu projeye neden katılmak istiyorsun?", text: $applyMessage, axis: .vertical)
                                            .padding()
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 14))
                                            .foregroundStyle(.white)
                                            .font(.caption)

                                        HStack(spacing: 12) {
                                            Button("Başvur") {
                                                Task {
                                                    await viewModel.apply(session: session, projectId: project.id, message: applyMessage)
                                                    applyMessage = ""
                                                    selectedProjectId = nil
                                                }
                                            }
                                            .disabled(applyMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                                            .font(.caption.bold())
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.primary)
                                            .foregroundStyle(.white)
                                            .clipShape(Capsule())
                                            .opacity(applyMessage.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? 0.5 : 1)

                                            Button("Vazgeç") {
                                                selectedProjectId = nil
                                                applyMessage = ""
                                            }
                                            .font(.caption.bold())
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .foregroundStyle(.white)
                                            .clipShape(Capsule())
                                        }
                                    } else {
                                        HStack(spacing: 12) {
                                            if let application = existingApplication(for: project.id) {
                                                Text(application.status == "accepted" ? "Başvurun kabul edildi" : application.status == "rejected" ? "Başvurun reddedildi" : "Zaten başvurdun")
                                                    .font(.caption.bold())
                                                    .foregroundStyle(application.status == "accepted" ? FoundrlyTheme.accent : FoundrlyTheme.textSecondary)
                                                    .padding(.horizontal, 16)
                                                    .padding(.vertical, 8)
                                                    .background(FoundrlyTheme.surfaceRaised)
                                                    .clipShape(Capsule())
                                            } else {
                                                Button("Hızlı Başvur") {
                                                    selectedProjectId = project.id
                                                }
                                                .font(.caption.bold())
                                                .padding(.horizontal, 16)
                                                .padding(.vertical, 8)
                                                .background(FoundrlyTheme.primary)
                                                .foregroundStyle(.white)
                                                .clipShape(Capsule())
                                            }

                                            NavigationLink {
                                                ProjectDetailView(project: project, viewModel: viewModel)
                                            } label: {
                                                Text("Detayları Gör")
                                                    .font(.caption.bold())
                                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                                    .padding(.horizontal, 16)
                                                    .padding(.vertical, 8)
                                                    .background(FoundrlyTheme.surfaceRaised)
                                                    .clipShape(Capsule())
                                            }
                                        }
                                    }
                                }
                                .foundrlyCard()
                            }
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Keşfet")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
