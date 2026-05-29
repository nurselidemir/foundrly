import SwiftUI

struct AdminPanelView: View {
    @EnvironmentObject private var session: AppSession
    @StateObject private var adminVM = AdminViewModel()

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
            
            ScrollView {
                VStack(spacing: 20) {
                    // Title Card
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Yönetim Paneli")
                            .font(.title2.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                        Text("Sistem genelindeki kullanıcıları, projeleri, etkinlikleri ve içerikleri yönetin.")
                            .font(.caption)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()
                    
                    // KPIs Grid
                    if let dashboard = adminVM.dashboard {
                        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                            kpiCard(title: "Toplam Üye", value: "\(dashboard.total_users)", icon: "person.3.fill", color: FoundrlyTheme.primary)
                            kpiCard(title: "Toplam Proje", value: "\(dashboard.total_projects)", icon: "folder.fill", color: FoundrlyTheme.accent)
                            kpiCard(title: "Mentörler", value: "\(dashboard.total_mentors)", icon: "person.2.fill", color: FoundrlyTheme.success)
                            kpiCard(title: "Etkinlikler", value: "\(dashboard.total_events)", icon: "calendar", color: FoundrlyTheme.warning)
                            kpiCard(title: "Makaleler", value: "\(dashboard.total_guides)", icon: "book.fill", color: FoundrlyTheme.info)
                            kpiCard(title: "Bekleyen Doğrulama", value: "\(adminVM.verifications.filter { $0.status == "pending" }.count)", icon: "checkmark.seal.fill", color: FoundrlyTheme.error)
                        }
                    } else if adminVM.isLoading {
                        ProgressView()
                            .tint(.white)
                            .padding()
                    }
                    
                    // Moderation Links
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Kontrol Alanları")
                            .font(.headline.weight(.bold))
                            .foregroundStyle(FoundrlyTheme.textPrimary)
                            .padding(.bottom, 4)
                        
                        NavigationLink {
                            AdminUsersView(adminVM: adminVM)
                        } label: {
                            adminLinkRow(title: "Kullanıcı Yönetimi", icon: "person.fill", desc: "Rol ve yetkilendirmeleri düzenle")
                        }
                        
                        NavigationLink {
                            AdminProjectsView(adminVM: adminVM)
                        } label: {
                            adminLinkRow(title: "Proje Yönetimi", icon: "folder.badge.gearshape", desc: "Projeleri listele ve yönet")
                        }
                        
                        NavigationLink {
                            AdminEventsView(adminVM: adminVM)
                        } label: {
                            adminLinkRow(title: "Etkinlik Yönetimi", icon: "calendar.badge.plus", desc: "Yeni etkinlik ekle veya sil")
                        }
                        
                        NavigationLink {
                            AdminGuidesView(adminVM: adminVM)
                        } label: {
                            adminLinkRow(title: "Makale Yönetimi (Girişim Merkezi)", icon: "book.closed.fill", desc: "Girişim merkezi rehberlerini yönet")
                        }
                        
                        NavigationLink {
                            AdminMentorsView(adminVM: adminVM)
                        } label: {
                            adminLinkRow(title: "Mentör Yönetimi", icon: "signature", desc: "Sistem mentörlerini ve ücretlerini gör")
                        }
                    }
                    .foundrlyCard()
                }
                .padding(20)
            }
        }
        .navigationTitle("Admin Paneli")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await adminVM.load(session: session)
        }
        }
    }
    
    private func kpiCard(title: String, value: String, icon: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: icon)
                    .font(.subheadline)
                    .foregroundStyle(color)
                    .padding(8)
                    .background(color.opacity(0.12))
                    .clipShape(Circle())
                
                Spacer()
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(value)
                    .font(.system(size: 24, weight: .black, design: .rounded))
                    .foregroundStyle(.white)
                Text(title)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }
    
    private func adminLinkRow(title: String, icon: String, desc: String) -> some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundStyle(FoundrlyTheme.primary)
                .frame(width: 32, height: 32)
                .background(FoundrlyTheme.primary.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 10))
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline.bold())
                    .foregroundStyle(FoundrlyTheme.textPrimary)
                Text(desc)
                    .font(.caption2)
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .padding(.vertical, 8)
    }
}
