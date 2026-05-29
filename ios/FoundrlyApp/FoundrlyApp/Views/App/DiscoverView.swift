import SwiftUI

struct DiscoverView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var selectedProjectId: Int?
    @State private var applyMessage = ""
    @State private var searchMode = 0 // 0 = Projeler, 1 = Ekip Üyeleri

    var discoverProjects: [ProjectCard] {
        viewModel.projects.filter { $0.owner.id != session.currentUser?.id }
    }

    var discoverUsers: [ShowcaseUser] {
        viewModel.showcaseUsers.filter { $0.id != session.currentUser?.id }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
                
                ScrollView {
                    VStack(spacing: 16) {
                        Picker("Keşif Modu", selection: $searchMode) {
                            Text("Projeler").tag(0)
                            Text("Ekip Üyeleri").tag(1)
                        }
                        .pickerStyle(.segmented)
                        .padding(.bottom, 8)

                        if searchMode == 0 {
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
                                                    HStack(spacing: 4) {
                                                        Text(project.owner.full_name + " · " + project.owner.title)
                                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                                            .font(.caption)
                                                        
                                                        if project.owner.is_verified_talent == true {
                                                            Image(systemName: "checkmark.seal.fill")
                                                                .font(.system(size: 10))
                                                                .foregroundStyle(FoundrlyTheme.accent)
                                                        }
                                                    }
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
                                        
                                        // Tech stack and roles chips
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
                                                .font(.caption.bold())
                                                .padding(.horizontal, 16)
                                                .padding(.vertical, 8)
                                                .background(FoundrlyTheme.primary)
                                                .foregroundStyle(.white)
                                                .clipShape(Capsule())

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
                                                Button("Hızlı Başvur") {
                                                    selectedProjectId = project.id
                                                }
                                                .font(.caption.bold())
                                                .padding(.horizontal, 16)
                                                .padding(.vertical, 8)
                                                .background(FoundrlyTheme.primary)
                                                .foregroundStyle(.white)
                                                .clipShape(Capsule())
                                                
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
                        } else {
                            if discoverUsers.isEmpty {
                                VStack(spacing: 12) {
                                    Image(systemName: "person.2.fill")
                                        .font(.system(size: 48))
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    Text("Ekip Arkadaşı Yok")
                                        .font(.headline)
                                        .foregroundStyle(FoundrlyTheme.textPrimary)
                                    Text("Şu an bağlantı kurabileceğiniz aktif kullanıcı bulunmuyor. Daha sonra tekrar kontrol edin.")
                                        .font(.footnote)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                        .multilineTextAlignment(.center)
                                }
                                .padding(40)
                                .frame(maxWidth: .infinity)
                                .foundrlyCard()
                            } else {
                                ForEach(discoverUsers) { user in
                                    VStack(alignment: .leading, spacing: 12) {
                                        HStack(spacing: 12) {
                                            // Initials circle as profile picture
                                            Text(user.full_name.prefix(2).uppercased())
                                                .font(.system(size: 14, weight: .bold))
                                                .foregroundStyle(.white)
                                                .frame(width: 40, height: 40)
                                                .background(FoundrlyTheme.primary.opacity(0.8))
                                                .clipShape(Circle())
                                            
                                            VStack(alignment: .leading, spacing: 2) {
                                                HStack(spacing: 6) {
                                                    NavigationLink {
                                                        PublicProfileView(viewModel: viewModel, userId: user.id)
                                                    } label: {
                                                        Text(user.full_name)
                                                            .font(.headline)
                                                            .foregroundStyle(.white)
                                                            .multilineTextAlignment(.leading)
                                                    }
                                                    
                                                    if user.is_verified_talent {
                                                        Image(systemName: "checkmark.seal.fill")
                                                            .font(.system(size: 14))
                                                            .foregroundStyle(FoundrlyTheme.accent)
                                                    }
                                                }
                                                
                                                Text(user.title)
                                                    .font(.caption)
                                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                            }
                                            
                                            Spacer()
                                            
                                            if user.is_premium {
                                                Text("PREMIUM")
                                                    .font(.system(size: 8, weight: .bold))
                                                    .foregroundStyle(.black)
                                                    .padding(.horizontal, 8)
                                                    .padding(.vertical, 4)
                                                    .background(FoundrlyTheme.accent)
                                                    .clipShape(Capsule())
                                            }
                                        }
                                        
                                        if !user.bio.isEmpty {
                                            Text(user.bio)
                                                .font(.subheadline)
                                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                                .lineLimit(3)
                                        }
                                        
                                        // Skills chips
                                        if !user.skills.isEmpty {
                                            ScrollView(.horizontal, showsIndicators: false) {
                                                HStack(spacing: 8) {
                                                    ForEach(user.skills, id: \.self) { skill in
                                                        Text(skill)
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
                                        
                                        HStack(spacing: 12) {
                                            NavigationLink {
                                                PublicProfileView(viewModel: viewModel, userId: user.id)
                                            } label: {
                                                Text("Profili İncele")
                                                    .font(.caption.bold())
                                                    .foregroundStyle(.white)
                                                    .padding(.horizontal, 16)
                                                    .padding(.vertical, 8)
                                                    .background(FoundrlyTheme.primary)
                                                    .clipShape(Capsule())
                                            }
                                        }
                                    }
                                    .foundrlyCard()
                                }
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
