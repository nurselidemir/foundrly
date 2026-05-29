import SwiftUI

struct AdminProjectsView: View {
    @ObservedObject var adminVM: AdminViewModel
    @EnvironmentObject private var session: AppSession
    
    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    if adminVM.projects.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "folder.badge.minus")
                                .font(.system(size: 48))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text("Proje Bulunmuyor")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                        }
                        .padding(40)
                        .frame(maxWidth: .infinity)
                        .foundrlyCard()
                    } else {
                        ForEach(adminVM.projects) { project in
                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    Text(project.title)
                                        .font(.subheadline.bold())
                                        .foregroundStyle(FoundrlyTheme.textPrimary)
                                    
                                    Spacer()
                                    
                                    Button(role: .destructive) {
                                        Task {
                                            await adminVM.deleteProject(session: session, projectId: project.id)
                                        }
                                    } label: {
                                        Image(systemName: "trash")
                                            .font(.footnote)
                                            .foregroundStyle(FoundrlyTheme.error)
                                    }
                                }
                                
                                Text(project.summary)
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .lineLimit(2)
                                
                                Divider()
                                    .background(FoundrlyTheme.border)
                                
                                HStack {
                                    Label(project.owner.full_name, systemImage: "person.fill")
                                        .font(.caption2.bold())
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    Spacer()
                                    
                                    HStack(spacing: 8) {
                                        Label("\(project.applications_count ?? 0)", systemImage: "paperplane.fill")
                                        Label("\(project.accepted_applications_count ?? 0)", systemImage: "checkmark.circle.fill")
                                    }
                                    .font(.caption2)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                }
                            }
                            .foundrlyCard()
                        }
                    }
                    
                    if !adminVM.feedbackMessage.isEmpty {
                        Text(adminVM.feedbackMessage)
                            .font(.footnote.weight(.semibold))
                            .foregroundStyle(FoundrlyTheme.accent)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .foundrlyCard()
                    }
                }
                .padding(20)
            }
        }
        .navigationTitle("Proje Yönetimi")
        .navigationBarTitleDisplayMode(.inline)
    }
}
