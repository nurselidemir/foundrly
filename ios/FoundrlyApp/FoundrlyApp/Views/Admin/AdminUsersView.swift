import SwiftUI

struct AdminUsersView: View {
    @ObservedObject var adminVM: AdminViewModel
    @EnvironmentObject private var session: AppSession
    
    @State private var selectedUser: AdminUserItem?
    @State private var showEditSheet = false
    
    // States for toggles in the detail sheet
    @State private var isPremium = false
    @State private var isMentor = false
    @State private var isVerifiedTalent = false
    @State private var isStaff = false
    @State private var isSuperuser = false
    @State private var mentorPrice = 0.0

    var filteredUsers: [AdminUserItem] {
        if adminVM.searchText.isEmpty {
            return adminVM.users
        } else {
            return adminVM.users.filter {
                $0.full_name.localizedCaseInsensitiveContains(adminVM.searchText) ||
                $0.email.localizedCaseInsensitiveContains(adminVM.searchText)
            }
        }
    }

    var body: some View {
        ZStack {
            FoundrlyBackground()
            
            VStack(spacing: 0) {
                // Search bar & Add Button
                HStack(spacing: 12) {
                    HStack(spacing: 6) {
                        Image(systemName: "magnifyingglass")
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        TextField("Kullanıcı Ara...", text: $adminVM.searchText)
                            .textFieldStyle(.plain)
                            .foregroundStyle(.white)
                    }
                    .padding(12)
                    .background(FoundrlyTheme.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14)
                            .stroke(FoundrlyTheme.border, lineWidth: 1)
                    )
                    
                    NavigationLink {
                        AdminCreateMentorView(adminVM: adminVM)
                    } label: {
                        Image(systemName: "person.badge.plus")
                            .font(.headline)
                            .foregroundStyle(.white)
                            .padding(14)
                            .background(FoundrlyTheme.primary)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .padding(.bottom, 16)
                
                ScrollView {
                    LazyVStack(spacing: 14) {
                        ForEach(filteredUsers) { user in
                            VStack(alignment: .leading, spacing: 10) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(user.full_name)
                                            .font(.subheadline.bold())
                                            .foregroundStyle(FoundrlyTheme.textPrimary)
                                        Text(user.email)
                                            .font(.caption2)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "chevron.right")
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                }
                                
                                HStack(spacing: 8) {
                                    if user.is_premium {
                                        roleBadge(text: "Premium", color: FoundrlyTheme.primary)
                                    }
                                    if user.is_mentor {
                                        roleBadge(text: "Mentör", color: FoundrlyTheme.success)
                                    }
                                    if user.is_verified_talent {
                                        roleBadge(text: "Doğrulanmış", color: FoundrlyTheme.accent)
                                    }
                                    if user.is_staff {
                                        roleBadge(text: "Admin", color: FoundrlyTheme.error)
                                    }
                                }
                            }
                            .foundrlyCard()
                            .onTapGesture {
                                selectedUser = user
                                isPremium = user.is_premium
                                isMentor = user.is_mentor
                                isVerifiedTalent = user.is_verified_talent
                                isStaff = user.is_staff
                                isSuperuser = user.is_superuser
                                mentorPrice = 0.0 // Default or retrieve
                                showEditSheet = true
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 20)
                }
            }
        }
        .navigationTitle("Kullanıcı Yönetimi")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showEditSheet) {
            if let user = selectedUser {
                ZStack {
                    FoundrlyTheme.surface.ignoresSafeArea()
                    ScrollView {
                        VStack(spacing: 20) {
                            Text("Kullanıcı Düzenle")
                                .font(.headline)
                                .foregroundStyle(FoundrlyTheme.textPrimary)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(user.full_name)
                                    .font(.title3.bold())
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                Text(user.email)
                                    .font(.footnote)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            
                            VStack(spacing: 12) {
                                Toggle("Premium Üye", isOn: $isPremium)
                                    .tint(FoundrlyTheme.primary)
                                Toggle("Sistem Mentörü", isOn: $isMentor)
                                    .tint(FoundrlyTheme.success)
                                Toggle("Doğrulanmış Yetenek", isOn: $isVerifiedTalent)
                                    .tint(FoundrlyTheme.accent)
                                Toggle("Staff (Admin)", isOn: $isStaff)
                                    .tint(FoundrlyTheme.error)
                            }
                            .foregroundStyle(.white)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            
                            HStack(spacing: 16) {
                                Button("İptal") {
                                    showEditSheet = false
                                }
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                                
                                Button("Kaydet") {
                                    Task {
                                        let roleUpdate = AdminRoleUpdate(
                                            is_mentor: isMentor,
                                            is_verified_talent: isVerifiedTalent,
                                            is_premium: isPremium,
                                            is_staff: isStaff,
                                            is_superuser: isSuperuser
                                        )
                                        await adminVM.updateUserRole(session: session, userId: user.id, update: roleUpdate)
                                        showEditSheet = false
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
                }
            }
        }
    }
    
    private func roleBadge(text: String, color: Color) -> some View {
        Text(text)
            .font(.system(size: 9, weight: .bold))
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.12))
            .clipShape(Capsule())
    }
}
