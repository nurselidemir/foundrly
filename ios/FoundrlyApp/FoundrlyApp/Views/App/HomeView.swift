import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    var discoverUsers: [ShowcaseUser] {
        viewModel.showcaseUsers.filter { $0.id != session.currentUser?.id }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
                
                ScrollView {
                    VStack(spacing: 20) {
                        if let summary = viewModel.summary {
                            
                            // 1. Welcome & Role Header
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("Hoş geldin,")
                                            .font(.subheadline)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                        Text(summary.profile.full_name)
                                            .font(.system(size: 26, weight: .black, design: .rounded))
                                            .foregroundStyle(.white)
                                    }
                                    
                                    Spacer()
                                    
                                    if session.isPremium {
                                        HStack(spacing: 4) {
                                            Image(systemName: "crown.fill")
                                            Text("PREMIUM")
                                        }
                                        .font(.system(size: 8, weight: .bold))
                                        .foregroundStyle(.black)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(FoundrlyTheme.accent)
                                        .clipShape(Capsule())
                                    }
                                }
                                
                                Text(summary.profile.title)
                                    .font(.footnote)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .foundrlyCard()

                            // 2. Premium / Active Sub Banner
                            if !session.isPremium {
                                NavigationLink {
                                    PremiumView(viewModel: viewModel)
                                } label: {
                                    HStack(spacing: 16) {
                                        Image(systemName: "crown.fill")
                                            .font(.system(size: 24))
                                            .foregroundStyle(.white)
                                            .padding(12)
                                            .background(FoundrlyTheme.accent.opacity(0.2))
                                            .clipShape(Circle())
                                        
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text("Foundrly Premium'a Katıl")
                                                .font(.subheadline.bold())
                                                .foregroundStyle(.white)
                                            Text("Yapay zeka ekip kurucusunu ve gelişmiş proje görünürlüğünü aç.")
                                                .font(.caption2)
                                                .foregroundStyle(.white.opacity(0.8))
                                                .multilineTextAlignment(.leading)
                                        }
                                        
                                        Spacer()
                                        
                                        Image(systemName: "chevron.right")
                                            .font(.caption)
                                            .foregroundStyle(.white.opacity(0.7))
                                    }
                                    .padding()
                                    .background(
                                        LinearGradient(
                                            colors: [FoundrlyTheme.primary, FoundrlyTheme.primary.opacity(0.6), FoundrlyTheme.accent],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        )
                                    )
                                    .clipShape(RoundedRectangle(cornerRadius: 20))
                                    .shadow(color: FoundrlyTheme.primary.opacity(0.4), radius: 10)
                                }
                            } else {
                                HStack(spacing: 12) {
                                    Image(systemName: "sparkles")
                                        .font(.system(size: 18))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                    Text("Premium Avantajları Aktif · Yapay Zeka Desteği Açık")
                                        .font(.caption.bold())
                                        .foregroundStyle(FoundrlyTheme.accent)
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(FoundrlyTheme.accent.opacity(0.08))
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(FoundrlyTheme.accent.opacity(0.2), lineWidth: 1)
                                )
                            }
                            
                            // 3. AI Team Builder Card
                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("AI Team Builder")
                                            .font(.headline.bold())
                                            .foregroundStyle(.white)
                                        Text("Projeniz için yapay zeka destekli kurucu ortak önerileri")
                                            .font(.caption)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                    }
                                    Spacer()
                                    Image(systemName: "sparkles")
                                        .font(.title2)
                                        .foregroundStyle(FoundrlyTheme.accent)
                                }
                                
                                NavigationLink {
                                    AIBuilderView(viewModel: viewModel)
                                } label: {
                                    HStack {
                                        Text("Yapay Zekayla Eşleşmeleri Gör")
                                            .font(.caption.bold())
                                        Spacer()
                                        Image(systemName: "arrow.right")
                                            .font(.caption)
                                    }
                                    .foregroundStyle(.white)
                                    .padding()
                                    .background(FoundrlyTheme.primary)
                                    .clipShape(RoundedRectangle(cornerRadius: 14))
                                }
                            }
                            .foundrlyCard()



                            // 5. AI Recommended Projects
                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    Text("Sana Özel Önerilen Projeler")
                                        .font(.headline.bold())
                                        .foregroundStyle(.white)
                                    Spacer()
                                    HStack(spacing: 4) {
                                        Image(systemName: "sparkles")
                                        Text("AI")
                                    }
                                    .font(.system(size: 8, weight: .bold))
                                    .foregroundStyle(FoundrlyTheme.accent)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 3)
                                    .background(FoundrlyTheme.accent.opacity(0.12))
                                    .clipShape(Capsule())
                                }
                                
                                if session.isPremium {
                                    if viewModel.recommendedProjects.isEmpty {
                                        Text("Yeteneklerinize ve ilgi alanlarınıza özel proje önerileri hazırlanıyor. Lütfen daha sonra tekrar kontrol edin.")
                                            .font(.caption)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                            .padding(.vertical, 8)
                                    } else {
                                        ForEach(viewModel.recommendedProjects.prefix(3)) { match in
                                            NavigationLink {
                                                ProjectDetailView(project: match.project, viewModel: viewModel)
                                            } label: {
                                                VStack(alignment: .leading, spacing: 8) {
                                                    HStack {
                                                        Text(match.project.title)
                                                            .font(.subheadline.bold())
                                                            .foregroundStyle(.white)
                                                        Spacer()
                                                        Text(match.match_label)
                                                            .font(.system(size: 9, weight: .bold))
                                                            .foregroundStyle(FoundrlyTheme.accent)
                                                            .padding(.horizontal, 8)
                                                            .padding(.vertical, 4)
                                                            .background(FoundrlyTheme.accent.opacity(0.12))
                                                            .clipShape(Capsule())
                                                    }
                                                    
                                                    Text(match.ai_summary)
                                                        .font(.caption)
                                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                                        .lineLimit(2)
                                                        .multilineTextAlignment(.leading)
                                                }
                                                .padding()
                                                .background(FoundrlyTheme.surfaceRaised.opacity(0.6))
                                                .clipShape(RoundedRectangle(cornerRadius: 16))
                                            }
                                        }
                                    }
                                } else {
                                    // Lock visual for standard users
                                    VStack(spacing: 12) {
                                        Image(systemName: "lock.fill")
                                            .font(.title2)
                                            .foregroundStyle(FoundrlyTheme.accent)
                                        Text("Yapay Zeka Proje Önerileri Kilitli")
                                            .font(.subheadline.bold())
                                            .foregroundStyle(.white)
                                        Text("Yeteneklerinize göre eşleştirilen projeleri ve yapay zeka uyum detaylarını görmek için Premium'a yükseltin.")
                                            .font(.caption2)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                            .multilineTextAlignment(.center)
                                            .padding(.horizontal, 10)
                                        
                                        NavigationLink {
                                            PremiumView(viewModel: viewModel)
                                        } label: {
                                            Text("Premium'a Geç")
                                                .font(.caption.bold())
                                                .foregroundStyle(.black)
                                                .padding(.horizontal, 16)
                                                .padding(.vertical, 8)
                                                .background(FoundrlyTheme.accent)
                                                .clipShape(Capsule())
                                        }
                                    }
                                    .padding(.vertical, 16)
                                    .frame(maxWidth: .infinity)
                                    .background(FoundrlyTheme.surfaceRaised.opacity(0.4))
                                    .clipShape(RoundedRectangle(cornerRadius: 18))
                                }
                            }
                            .foundrlyCard()

                            // 6. Showcase Teammates (Ekip Arkadaşlarım)
                            VStack(alignment: .leading, spacing: 14) {
                                HStack {
                                    Text("Öne Çıkan Girişimci ve Yetenekler")
                                        .font(.headline.weight(.bold))
                                        .foregroundStyle(FoundrlyTheme.textPrimary)
                                    Spacer()
                                }
                                
                                if discoverUsers.isEmpty {
                                    Text("Önerilen yetenek bulunmuyor.")
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                } else {
                                    ForEach(discoverUsers.prefix(3)) { user in
                                        NavigationLink {
                                            PublicProfileView(viewModel: viewModel, userId: user.id)
                                        } label: {
                                            HStack(spacing: 12) {
                                                Text(user.full_name.prefix(2).uppercased())
                                                    .font(.system(size: 12, weight: .bold))
                                                    .foregroundStyle(.white)
                                                    .frame(width: 36, height: 36)
                                                    .background(FoundrlyTheme.primary.opacity(0.8))
                                                    .clipShape(Circle())
                                                
                                                VStack(alignment: .leading, spacing: 2) {
                                                    HStack(spacing: 4) {
                                                        Text(user.full_name)
                                                            .font(.subheadline.bold())
                                                            .foregroundStyle(.white)
                                                        
                                                        if user.is_verified_talent {
                                                            Image(systemName: "checkmark.seal.fill")
                                                                .font(.system(size: 10))
                                                                .foregroundStyle(FoundrlyTheme.accent)
                                                        }
                                                    }
                                                    
                                                    Text(user.title)
                                                        .font(.caption2)
                                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                                }
                                                
                                                Spacer()
                                                
                                                Image(systemName: "chevron.right")
                                                    .font(.caption2)
                                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                            }
                                            .padding()
                                            .background(FoundrlyTheme.surfaceRaised.opacity(0.6))
                                            .clipShape(RoundedRectangle(cornerRadius: 16))
                                        }
                                    }
                                }
                            }
                            .foundrlyCard()

                            // 7. Dashboard KPI Grid (2x3)
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                                metricCard("Projelerim", "\(summary.metrics.owned_projects_count)", icon: "folder.fill")
                                metricCard("Gelen Başvurular", "\(summary.metrics.received_applications_count)", icon: "paperplane.fill")
                                metricCard("Bekleyen", "\(summary.metrics.pending_received_applications_count)", icon: "clock.fill")
                                metricCard("Kabul Edilen", "\(summary.metrics.accepted_received_applications_count)", icon: "checkmark.circle.fill")
                                metricCard("Gönderdiklerim", "\(summary.metrics.sent_applications_count)", icon: "arrow.up.right.circle.fill")
                                metricCard("Ekiplerim", "\(summary.metrics.accepted_memberships_count)", icon: "person.3.fill")
                            }

                            // 8. Quick Navigation Cards
                            VStack(alignment: .leading, spacing: 14) {
                                Text("Hızlı Erişim")
                                    .font(.headline.weight(.bold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                
                                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                                    NavigationLink {
                                        EventsView(viewModel: viewModel)
                                    } label: {
                                        quickNavCard("Etkinlikler", icon: "calendar", desc: "Topluluk etkinlikleri")
                                    }
                                    
                                    NavigationLink {
                                        HubView(viewModel: viewModel)
                                    } label: {
                                        quickNavCard("Rehberler", icon: "book.fill", desc: "Girişim merkezi")
                                    }
                                    
                                    NavigationLink {
                                        AIBuilderView(viewModel: viewModel)
                                    } label: {
                                        quickNavCard("AI Kurucu", icon: "sparkles", desc: "Yapay zeka eşleşme")
                                    }
                                }
                            }
                            .foundrlyCard()
                            
                        } else if viewModel.isLoading {
                            ProgressView()
                                .tint(.white)
                                .padding()
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
            .navigationTitle("Foundrly")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    private func metricCard(_ title: String, _ value: String, icon: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: icon)
                    .font(.caption)
                    .foregroundStyle(FoundrlyTheme.primary)
                Spacer()
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.system(size: 24, weight: .black, design: .rounded))
                    .foregroundStyle(.white)
                Text(title.uppercased())
                    .font(.system(size: 8, weight: .bold))
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }
    
    private func quickNavCard(_ title: String, icon: String, desc: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.primary)
                .padding(8)
                .background(FoundrlyTheme.primary.opacity(0.12))
                .clipShape(Circle())
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption.bold())
                    .foregroundStyle(.white)
                Text(desc)
                    .font(.system(size: 8))
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(FoundrlyTheme.surfaceRaised)
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }
}
