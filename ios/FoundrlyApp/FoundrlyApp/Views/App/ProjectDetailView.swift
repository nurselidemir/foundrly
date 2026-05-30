import SwiftUI

struct ProjectDetailView: View {
    let project: ProjectCard
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    @State private var applyMessage = ""
    @State private var showApplySheet = false

    var isOwner: Bool {
        project.owner.id == session.currentUser?.id
    }

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    // Header card
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            if project.is_premium_highlighted {
                                Text("PREMIUM ÖNE ÇIKAN")
                                    .font(.system(size: 8, weight: .bold))
                                    .foregroundStyle(.black)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(FoundrlyTheme.accent)
                                    .clipShape(Capsule())
                            }
                            
                            Spacer()
                            
                            Text(project.created_at)
                                .font(.caption2)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        }
                        
                        Text(project.title)
                            .font(.title2.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        
                        NavigationLink {
                            PublicProfileView(viewModel: viewModel, userId: project.owner.id)
                        } label: {
                            HStack(spacing: 8) {
                                Image(systemName: "person.crop.circle.fill")
                                    .font(.title3)
                                Text("Sahibi: \(project.owner.full_name)")
                                    .font(.subheadline.weight(.semibold))
                                if project.owner.is_verified_talent == true {
                                    Image(systemName: "checkmark.seal.fill")
                                        .foregroundStyle(FoundrlyTheme.accent)
                                }
                            }
                            .foregroundStyle(FoundrlyTheme.primary)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()
                    
                    // Summary & Problem Statement
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Proje Özeti")
                            .font(.headline.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        
                        Text(project.summary)
                            .font(.body)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        
                        if let problem = project.problem_statement, !problem.isEmpty {
                            Divider()
                                .background(FoundrlyTheme.border)
                                .padding(.vertical, 4)
                            
                            Text("Çözülen Problem")
                                .font(.headline.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            
                            Text(problem)
                                .font(.body)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()
                    
                    // Tech Stack & Needed Roles
                    if (project.tech_stack?.isEmpty == false) || (project.needed_roles?.isEmpty == false) {
                        VStack(alignment: .leading, spacing: 16) {
                            if let stack = project.tech_stack, !stack.isEmpty {
                                Text("Teknoloji Yığını")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                FlowLayout(items: stack) { tech in
                                    Text(tech)
                                        .font(.caption.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.primary)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(FoundrlyTheme.primary.opacity(0.12))
                                        .clipShape(Capsule())
                                }
                            }
                            
                            if let roles = project.needed_roles, !roles.isEmpty {
                                if project.tech_stack?.isEmpty == false {
                                    Divider()
                                        .background(FoundrlyTheme.border)
                                        .padding(.vertical, 4)
                                }
                                
                                Text("Aranan Ekip Arkadaşlarından Beklentiler")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                FlowLayout(items: roles) { role in
                                    Text(role)
                                        .font(.caption.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 5)
                                        .background(FoundrlyTheme.accent.opacity(0.12))
                                        .clipShape(Capsule())
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()
                    }
                    
                    // Mevcut Takım Section
                    let teamMembers = viewModel.receivedApplications.filter { $0.project == project.id && $0.status == "accepted" }
                    
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Mevcut Takım")
                            .font(.headline.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        
                        HStack(spacing: -8) {
                            // Show owner first
                            NavigationLink {
                                PublicProfileView(viewModel: viewModel, userId: project.owner.id)
                            } label: {
                                Text(project.owner.full_name.prefix(2).uppercased())
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundStyle(.white)
                                    .frame(width: 32, height: 32)
                                    .background(FoundrlyTheme.primary)
                                    .clipShape(Circle())
                                    .overlay(Circle().stroke(FoundrlyTheme.surface, lineWidth: 1.5))
                            }
                            
                            // Then accepted members
                            ForEach(teamMembers) { app in
                                NavigationLink {
                                    PublicProfileView(viewModel: viewModel, userId: app.applicant.id)
                                } label: {
                                    Text(app.applicant.full_name.prefix(2).uppercased())
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundStyle(.white)
                                        .frame(width: 32, height: 32)
                                        .background(FoundrlyTheme.accent)
                                        .clipShape(Circle())
                                        .overlay(Circle().stroke(FoundrlyTheme.surface, lineWidth: 1.5))
                                }
                            }
                        }
                        .padding(.top, 4)
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Sahibi: \(project.owner.full_name) (\(project.owner.title))")
                                .font(.caption)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            
                            ForEach(teamMembers) { app in
                                Text("\(app.applicant.full_name) (\(app.applicant.title))")
                                    .font(.caption)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()
                    
                    // Applications / CTA
                    if isOwner {
                        // Show received applications for this project
                        let apps = viewModel.receivedApplications.filter { $0.project == project.id }
                        
                        VStack(alignment: .leading, spacing: 16) {
                            Text("Gelen Başvurular (\(apps.count))")
                                .font(.headline.weight(.bold))
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            
                            if apps.isEmpty {
                                Text("Henüz başvuru yapılmadı.")
                                    .font(.footnote)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            } else {
                                ForEach(apps) { app in
                                    VStack(alignment: .leading, spacing: 10) {
                                        HStack {
                                            NavigationLink {
                                                PublicProfileView(viewModel: viewModel, userId: app.applicant.id)
                                            } label: {
                                                Text(app.applicant.full_name)
                                                    .font(.subheadline.bold())
                                                    .foregroundStyle(FoundrlyTheme.primary)
                                            }
                                            
                                            Spacer()
                                            
                                            FoundrlyStatusBadge(status: app.status)
                                        }
                                        
                                        Text(app.message)
                                            .font(.caption)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                        
                                        if app.status == "pending" {
                                            HStack(spacing: 12) {
                                                Button {
                                                    Task {
                                                        await viewModel.updateApplicationStatus(session: session, applicationId: app.id, status: "accepted")
                                                    }
                                                } label: {
                                                    Text("Kabul Et")
                                                        .font(.caption.bold())
                                                        .foregroundStyle(.white)
                                                        .padding(.horizontal, 16)
                                                        .padding(.vertical, 8)
                                                        .background(FoundrlyTheme.accent)
                                                        .clipShape(Capsule())
                                                }
                                                
                                                Button {
                                                    Task {
                                                        await viewModel.updateApplicationStatus(session: session, applicationId: app.id, status: "rejected")
                                                    }
                                                } label: {
                                                    Text("Reddet")
                                                        .font(.caption.bold())
                                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                                        .padding(.horizontal, 16)
                                                        .padding(.vertical, 8)
                                                        .background(FoundrlyTheme.surfaceRaised)
                                                        .clipShape(Capsule())
                                                }
                                            }
                                            .padding(.top, 4)
                                        }
                                    }
                                    .padding()
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 16))
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()
                    } else {
                        // Apply button for non-owner
                        Button {
                            showApplySheet = true
                        } label: {
                            Text("Projeye Başvur")
                                .font(.headline.weight(.bold))
                                .foregroundStyle(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.primary)
                                .clipShape(RoundedRectangle(cornerRadius: 16))
                                .shadow(color: FoundrlyTheme.primary.opacity(0.3), radius: 10, y: 5)
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
        .navigationTitle(project.title)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showApplySheet) {
            ZStack {
                FoundrlyTheme.surface.ignoresSafeArea()
                VStack(spacing: 20) {
                    Text("Başvuru Mesajı")
                        .font(.headline)
                        .foregroundStyle(FoundrlyTheme.textPrimary)
                    
                    Text("Projeye neden katılmak istediğinizi ve yeteneklerinizi açıklayın.")
                        .font(.caption)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                        .multilineTextAlignment(.center)
                    
                    TextField("Mesajınızı girin...", text: $applyMessage, axis: .vertical)
                        .textFieldStyle(.plain)
                        .lineLimit(4...8)
                        .padding()
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .foregroundStyle(.white)
                    
                    HStack(spacing: 16) {
                        Button("İptal") {
                            showApplySheet = false
                        }
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        
                        Button("Gönder") {
                            Task {
                                await viewModel.apply(session: session, projectId: project.id, message: applyMessage)
                                showApplySheet = false
                                applyMessage = ""
                            }
                        }
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(FoundrlyTheme.primary)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                }
                .padding(24)
            }
            .presentationDetents([.medium])
        }
    }
}

// Simple flexible FlowLayout for tags
struct FlowLayout<T: Hashable, V: View>: View {
    let items: [T]
    let content: (T) -> V
    
    var body: some View {
        var width = CGFloat.zero
        var height = CGFloat.zero
        
        return GeometryReader { geo in
            ZStack(alignment: .topLeading) {
                ForEach(self.items, id: \.self) { item in
                    self.content(item)
                        .padding([.horizontal, .vertical], 4)
                        .alignmentGuide(.leading, computeValue: { d in
                            if (abs(width - d.width) > geo.size.width) {
                                width = 0
                                height -= d.height
                            }
                            let result = width
                            if item == self.items.last! {
                                width = 0 // last item
                            } else {
                                width -= d.width
                            }
                            return result
                        })
                        .alignmentGuide(.top, computeValue: { _ in
                            let result = height
                            if item == self.items.last! {
                                height = 0 // last item
                            }
                            return result
                        })
                }
            }
        }
        .frame(minHeight: 80) // default fallback
    }
}
