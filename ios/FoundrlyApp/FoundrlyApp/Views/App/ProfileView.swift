import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel

    @State private var isEditing = false
    
    // Edit profile states
    @State private var fullName = ""
    @State private var titleField = ""
    @State private var bio = ""
    @State private var skillsString = ""
    @State private var interestsString = ""

    // Verification states
    @State private var verificationTitle = ""
    @State private var verificationPortfolio = ""
    @State private var verificationNote = ""

    var body: some View {
        NavigationStack {
            ZStack {
                FoundrlyBackground()
                
                ScrollView {
                    VStack(spacing: 20) {
                        if let user = session.currentUser {
                            // Profile Header / Edit Mode Card
                            VStack(spacing: 16) {
                                HStack(spacing: 16) {
                                    // Profile photo initial circle
                                    let initials = user.full_name.split(separator: " ").compactMap { $0.first }.map { String($0) }.joined()
                                    Text(initials.uppercased())
                                        .font(.title.weight(.black))
                                        .foregroundStyle(.white)
                                        .frame(width: 72, height: 72)
                                        .background(FoundrlyTheme.primary)
                                        .clipShape(Circle())
                                        .shadow(color: FoundrlyTheme.primary.opacity(0.3), radius: 8)
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        HStack(spacing: 6) {
                                            Text(user.full_name)
                                                .font(.title3.weight(.bold))
                                                .foregroundStyle(FoundrlyTheme.textPrimary)
                                            if user.is_verified_talent == true {
                                                Image(systemName: "checkmark.seal.fill")
                                                    .foregroundStyle(FoundrlyTheme.accent)
                                            }
                                        }
                                        Text(user.title)
                                            .font(.footnote)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                    }
                                    
                                    Spacer()
                                }
                                
                                Divider()
                                    .background(FoundrlyTheme.border)
                                
                                if isEditing {
                                    VStack(spacing: 12) {
                                        TextField("Ad Soyad", text: $fullName)
                                            .textFieldStyle(.plain)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                        
                                        TextField("Ünvan", text: $titleField)
                                            .textFieldStyle(.plain)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                        
                                        TextField("Hakkımda", text: $bio, axis: .vertical)
                                            .textFieldStyle(.plain)
                                            .lineLimit(2...4)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                        
                                        TextField("Yetenekler (virgülle ayırın)", text: $skillsString)
                                            .textFieldStyle(.plain)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                        
                                        TextField("İlgi Alanları (virgülle ayırın)", text: $interestsString)
                                            .textFieldStyle(.plain)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                        
                                        Button {
                                            Task {
                                                let skills = skillsString.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
                                                let interests = interestsString.split(separator: ",").map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }.filter { !$0.isEmpty }
                                                let fields: [String: Any] = [
                                                    "full_name": fullName,
                                                    "title": titleField,
                                                    "bio": bio,
                                                    "skills": skills,
                                                    "interests": interests
                                                ]
                                                await viewModel.updateProfile(session: session, fields: fields)
                                                isEditing = false
                                            }
                                        } label: {
                                            Text("Kaydet")
                                                .font(.subheadline.bold())
                                                .foregroundStyle(.black)
                                                .frame(maxWidth: .infinity)
                                                .padding(.vertical, 10)
                                                .background(FoundrlyTheme.accent)
                                                .clipShape(Capsule())
                                        }
                                    }
                                } else {
                                    VStack(alignment: .leading, spacing: 10) {
                                        Text(user.bio.isEmpty ? "Henüz hakkında yazısı eklenmemiş." : user.bio)
                                            .font(.footnote)
                                            .foregroundStyle(FoundrlyTheme.textSecondary)
                                            .lineLimit(4)
                                        
                                        HStack(spacing: 8) {
                                            badge(user.is_premium ? "Premium" : "Standart", tint: user.is_premium ? FoundrlyTheme.primary : .white.opacity(0.16))
                                            badge(user.is_verified_talent ? "Doğrulanmış" : "Rozet Yok", tint: user.is_verified_talent ? FoundrlyTheme.accent : .white.opacity(0.16))
                                        }
                                        
                                        HStack {
                                            Text("Katılım Tarihi:")
                                                .font(.caption2)
                                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                            Text(user.date_joined)
                                                .font(.caption2.bold())
                                                .foregroundStyle(.white)
                                        }
                                        .padding(.top, 4)
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    
                                    Button {
                                        fullName = user.full_name
                                        titleField = user.title
                                        bio = user.bio
                                        skillsString = user.skills.joined(separator: ", ")
                                        interestsString = user.interests.joined(separator: ", ")
                                        isEditing = true
                                    } label: {
                                        Text("Profili Düzenle")
                                            .font(.caption.bold())
                                            .foregroundStyle(FoundrlyTheme.primary)
                                            .padding(.horizontal, 16)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.primary.opacity(0.12))
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                            .foundrlyCard()
                            
                            // Skills & Interests Card
                            if !isEditing {
                                VStack(alignment: .leading, spacing: 14) {
                                    Text("Yetenekler")
                                        .font(.headline.weight(.semibold))
                                        .foregroundStyle(FoundrlyTheme.textPrimary)
                                    skillWrap(user.skills)
                                    
                                    Text("İlgi Alanları")
                                        .font(.headline.weight(.semibold))
                                        .foregroundStyle(FoundrlyTheme.textPrimary)
                                    skillWrap(user.interests)
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .foundrlyCard()
                            }
                            
                            // Quick Management / Admin Links Card
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Yönetim & Erişim")
                                    .font(.headline.weight(.semibold))
                                    .foregroundStyle(FoundrlyTheme.textPrimary)
                                    .padding(.bottom, 4)
                                
                                if session.isAdmin {
                                    NavigationLink {
                                        AdminPanelView()
                                    } label: {
                                        menuRow(title: "Admin Paneli", icon: "shield.fill", color: FoundrlyTheme.error)
                                    }
                                }
                                
                                if session.isMentor {
                                    NavigationLink {
                                        MentorsView(viewModel: viewModel)
                                    } label: {
                                        menuRow(title: "Mentör Paneli", icon: "signature", color: FoundrlyTheme.success)
                                    }
                                }
                                
                                NavigationLink {
                                    PremiumView(viewModel: viewModel)
                                } label: {
                                    menuRow(title: "Premium Üyelik", icon: "crown.fill", color: FoundrlyTheme.accent)
                                }
                                
                                NavigationLink {
                                    MentorshipUserView(viewModel: viewModel)
                                } label: {
                                    menuRow(title: "Mentörlük Taleplerim", icon: "person.2.fill", color: FoundrlyTheme.primary)
                                }
                            }
                            .foundrlyCard()

                            // Premium & Verification Area
                            if !user.is_premium {
                                VStack(alignment: .leading, spacing: 12) {
                                    Text("Premium Ayrıcalıkları")
                                        .font(.headline)
                                    Text("AI ekip eşleşmeleri, doğrulanmış yetenek rozeti ve daha yüksek görünürlük için Premium'a yükseltin.")
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    NavigationLink {
                                        PremiumView(viewModel: viewModel)
                                    } label: {
                                        Text("Planları İncele")
                                            .font(.subheadline.bold())
                                            .foregroundStyle(.white)
                                            .frame(maxWidth: .infinity)
                                            .padding()
                                            .background(FoundrlyTheme.primary)
                                            .clipShape(RoundedRectangle(cornerRadius: 16))
                                    }
                                }
                                .foundrlyCard()
                            } else if !user.is_verified_talent {
                                VStack(alignment: .leading, spacing: 12) {
                                    Text("Doğrulanmış Yetenek Başvurusu")
                                        .font(.headline)
                                    Text("Profilinize doğrulanmış yetenek rozeti eklenmesi için başvurunuzu iletin.")
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    
                                    VStack(spacing: 10) {
                                        TextField("Başvuru Ünvanı", text: $verificationTitle)
                                            .textFieldStyle(.plain)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                        
                                        TextField("Portfolyo URL", text: $verificationPortfolio)
                                            .textFieldStyle(.plain)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                        
                                        TextField("Notunuz", text: $verificationNote, axis: .vertical)
                                            .textFieldStyle(.plain)
                                            .lineLimit(2...3)
                                            .padding(10)
                                            .background(FoundrlyTheme.surfaceRaised)
                                            .clipShape(RoundedRectangle(cornerRadius: 10))
                                            .foregroundStyle(.white)
                                    }
                                    .font(.caption)
                                    
                                    Button {
                                        Task {
                                            await viewModel.submitVerification(
                                                session: session,
                                                requestedTitle: verificationTitle,
                                                portfolioURL: verificationPortfolio,
                                                note: verificationNote
                                            )
                                            verificationTitle = ""
                                            verificationPortfolio = ""
                                            verificationNote = ""
                                        }
                                    } label: {
                                        Text("Başvuruyu Gönder")
                                            .font(.subheadline.bold())
                                            .foregroundStyle(.black)
                                            .frame(maxWidth: .infinity)
                                            .padding()
                                            .background(FoundrlyTheme.accent)
                                            .clipShape(RoundedRectangle(cornerRadius: 16))
                                    }
                                }
                                .foundrlyCard()
                            }
                            
                            if !viewModel.feedbackMessage.isEmpty {
                                Text(viewModel.feedbackMessage)
                                    .font(.footnote.weight(.semibold))
                                    .foregroundStyle(FoundrlyTheme.accent)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .foundrlyCard()
                            }
                            
                            Button("Çıkış Yap") {
                                session.clear()
                            }
                            .fontWeight(.bold)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(FoundrlyTheme.error.opacity(0.12))
                            .foregroundStyle(FoundrlyTheme.error)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                            .padding(.top, 10)
                        }
                    }
                    .padding(20)
                }
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .navigationTitle("Profilim")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private func badge(_ title: String, tint: Color) -> some View {
        Text(title)
            .font(.caption.bold())
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(tint)
            .clipShape(Capsule())
    }

    private func skillWrap(_ items: [String]) -> some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(items, id: \.self) { item in
                    Text(item)
                        .font(.caption.bold())
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(Capsule())
                }
            }
        }
    }
    
    private func menuRow(title: String, icon: String, color: Color) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 16))
                .foregroundStyle(color)
                .frame(width: 28, height: 28)
                .background(color.opacity(0.12))
                .clipShape(RoundedRectangle(cornerRadius: 8))
            
            Text(title)
                .font(.subheadline.bold())
                .foregroundStyle(FoundrlyTheme.textPrimary)
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .padding(.vertical, 6)
    }
}
