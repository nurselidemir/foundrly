import SwiftUI

struct MyProjectsView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var myProjects: [ProjectCard] {
        viewModel.projects.filter { $0.owner.id == session.currentUser?.id }
    }

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    if myProjects.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "folder.badge.questionmark")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Henüz Projeniz Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            Text("Oluştur sekmesinden ilk projenizi ekleyerek takım arkadaşlarınızı aramaya başlayın.")
                                .font(.footnote)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        ForEach(myProjects) { project in
                            VStack(alignment: .leading, spacing: 16) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(project.title)
                                        .font(.title3.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.textPrimary)
                                    Text(project.summary)
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        .lineLimit(2)
                                }
                                
                                let apps = viewModel.receivedApplications.filter { $0.project == project.id }
                                
                                VStack(alignment: .leading, spacing: 10) {
                                    Text("Başvurular (\(apps.count))")
                                        .font(.caption.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    if apps.isEmpty {
                                        Text("Bu projeye henüz başvuru yapılmamış.")
                                            .font(.caption)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                            .italic()
                                    } else {
                                        ForEach(apps) { app in
                                            VStack(alignment: .leading, spacing: 8) {
                                                HStack {
                                                    NavigationLink {
                                                        PublicProfileView(viewModel: viewModel, userId: app.applicant.id)
                                                    } label: {
                                                        HStack(spacing: 4) {
                                                            Image(systemName: "person.circle.fill")
                                                            Text(app.applicant.full_name)
                                                                .font(.footnote.bold())
                                                        }
                                                        .foregroundStyle(FoundrlyTheme.primary)
                                                    }
                                                    
                                                    Spacer()
                                                    
                                                    FoundrlyStatusBadge(status: app.status)
                                                }
                                                
                                                Text(app.message)
                                                    .font(.caption2)
                                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                                
                                                if app.status == "pending" {
                                                    HStack(spacing: 12) {
                                                        Button {
                                                            Task {
                                                                await viewModel.updateApplicationStatus(session: session, applicationId: app.id, status: "accepted")
                                                            }
                                                        } label: {
                                                            Text("Kabul Et")
                                                                .font(.caption2.bold())
                                                                .foregroundStyle(.white)
                                                                .padding(.horizontal, 12)
                                                                .padding(.vertical, 6)
                                                                .background(FoundrlyTheme.accent)
                                                                .clipShape(Capsule())
                                                        }
                                                        
                                                        Button {
                                                            Task {
                                                                await viewModel.updateApplicationStatus(session: session, applicationId: app.id, status: "rejected")
                                                            }
                                                        } label: {
                                                            Text("Reddet")
                                                                .font(.caption2.bold())
                                                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                                                .padding(.horizontal, 12)
                                                                .padding(.vertical, 6)
                                                                .background(FoundrlyTheme.surfaceRaised)
                                                                .clipShape(Capsule())
                                                        }
                                                    }
                                                    .padding(.top, 2)
                                                }
                                            }
                                            .padding(12)
                                            .background(FoundrlyTheme.surfaceRaised.opacity(0.6))
                                            .clipShape(RoundedRectangle(cornerRadius: 14))
                                        }
                                    }
                                }
                                .padding(.top, 4)
                            }
                            .foundrlyCard()
                        }
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
        }
        .navigationTitle("Projelerim")
        .navigationBarTitleDisplayMode(.inline)
    }
}
