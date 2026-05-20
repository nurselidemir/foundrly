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
            ScrollView {
                VStack(spacing: 18) {
                    if let summary = viewModel.summary {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Hoş geldin, \(summary.profile.full_name)")
                                .font(.system(size: 28, weight: .black, design: .rounded))
                            Text(summary.profile.title)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()

                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                            metricCard("Projelerim", "\(summary.metrics.owned_projects_count)")
                            metricCard("Gelen Başvurular", "\(summary.metrics.received_applications_count)")
                            metricCard("Bekleyen", "\(summary.metrics.pending_received_applications_count)")
                            metricCard("Kabul Edilen", "\(summary.metrics.accepted_received_applications_count)")
                        }
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Hızlı Proje Oluştur")
                            .font(.title2.bold())

                        Group {
                            TextField("Proje başlığı", text: $projectTitle)
                            TextField("Kısa özet", text: $projectSummary)
                            TextField("Problem tanımı", text: $projectProblem, axis: .vertical)
                            TextField("Teknolojiler", text: $techStack)
                            TextField("Aranan roller", text: $roles)
                        }
                        .padding()
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                        Button("Projeyi Oluştur") {
                            Task {
                                await viewModel.createProject(
                                    session: session,
                                    request: CreateProjectRequest(
                                        title: projectTitle,
                                        summary: projectSummary,
                                        problem_statement: projectProblem,
                                        tech_stack: techStack.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) },
                                        needed_roles: roles.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                                    )
                                )
                                projectTitle = ""
                                projectSummary = ""
                                projectProblem = ""
                                techStack = ""
                                roles = ""
                            }
                        }
                        .fontWeight(.bold)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(FoundrlyTheme.primary)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                    }
                    .foundrlyCard()

                    if !viewModel.receivedApplications.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Gelen Başvurular")
                                .font(.title2.bold())

                            ForEach(viewModel.receivedApplications.prefix(4)) { application in
                                VStack(alignment: .leading, spacing: 10) {
                                    NavigationLink {
                                        PublicProfileView(viewModel: viewModel, userId: application.applicant.id)
                                    } label: {
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(application.applicant.full_name)
                                                .font(.headline)
                                                .foregroundStyle(.white)
                                            Text(application.applicant.title)
                                                .font(.subheadline)
                                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                        }
                                    }

                                    Text(application.message)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)

                                    if application.status == "pending" {
                                        HStack {
                                            Button("Kabul Et") {
                                                Task {
                                                    await viewModel.updateApplicationStatus(
                                                        session: session,
                                                        applicationId: application.id,
                                                        status: "accepted"
                                                    )
                                                }
                                            }
                                            .fontWeight(.bold)
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 10)
                                            .background(FoundrlyTheme.accent)
                                            .foregroundStyle(.black)
                                            .clipShape(Capsule())

                                            Button("Reddet") {
                                                Task {
                                                    await viewModel.updateApplicationStatus(
                                                        session: session,
                                                        applicationId: application.id,
                                                        status: "rejected"
                                                    )
                                                }
                                            }
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(Capsule())
                                        }
                                    } else {
                                        Text(application.status == "accepted" ? "Kabul edildi" : "Reddedildi")
                                            .font(.caption.bold())
                                            .foregroundStyle(application.status == "accepted" ? FoundrlyTheme.accent : .red.opacity(0.85))
                                    }
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                            }
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
            .navigationTitle("Foundrly")
        }
    }

    private func metricCard(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title.uppercased())
                .font(.caption.weight(.bold))
                .foregroundStyle(FoundrlyTheme.textSecondary)
            Text(value)
                .font(.system(size: 28, weight: .black, design: .rounded))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }
}
