import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var verificationTitle = ""
    @State private var verificationPortfolio = ""
    @State private var verificationNote = ""

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 18) {
                    if let user = session.currentUser {
                        profileHero(user)
                        expertise(user)
                        premiumArea(user)

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
                        .foundrlySecondaryButton()
                    }
                }
                .padding(20)
                .padding(.bottom, 40)
            }
            .foundrlyScreen()
            .navigationTitle("Profilim")
        }
    }

    private func profileHero(_ user: CurrentUser) -> some View {
        VStack(alignment: .leading, spacing: 18) {
            HStack(alignment: .top, spacing: 16) {
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [FoundrlyTheme.primaryBright, FoundrlyTheme.accent],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 74, height: 74)
                    Text(initials(from: user.full_name))
                        .font(.title.bold())
                        .foregroundStyle(.white)
                }

                VStack(alignment: .leading, spacing: 8) {
                    Text(user.full_name)
                        .font(.system(size: 30, weight: .black, design: .rounded))
                    Text(user.title)
                        .font(.headline)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                }
                Spacer()
            }

            Text(user.bio)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.textSecondary)

            HStack(spacing: 8) {
                FoundrlyPill(
                    title: user.is_premium ? "Premium" : "Standart",
                    tint: user.is_premium ? FoundrlyTheme.gold.opacity(0.22) : FoundrlyTheme.surfaceSoft,
                    textColor: user.is_premium ? FoundrlyTheme.gold : .white
                )
                FoundrlyPill(
                    title: user.is_verified_talent ? "Doğrulanmış Yetenek" : "Rozet Bekliyor",
                    tint: user.is_verified_talent ? FoundrlyTheme.accent.opacity(0.18) : FoundrlyTheme.surfaceSoft,
                    textColor: user.is_verified_talent ? FoundrlyTheme.accent : .white
                )
            }

            HStack(spacing: 12) {
                spotlight("Katılım", String(user.date_joined.prefix(10)))
                spotlight("Mentör Kredi", "\(user.mentor_credits ?? 0)")
                spotlight("Görünürlük", user.is_premium ? "Yüksek" : "Temel")
            }
        }
        .foundrlyCard()
    }

    private func expertise(_ user: CurrentUser) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "Uzmanlık",
                title: "Profil sinyallerin",
                subtitle: "Mobil uygulamada da web’deki premium vitrin hissini veren alanlar."
            )

            labelRow("Yetenekler", user.skills)
            labelRow("İlgi Alanları", user.interests)
        }
        .foundrlyCard()
    }

    private func premiumArea(_ user: CurrentUser) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            if !user.is_premium {
                FoundrlySectionHeader(
                    eyebrow: "Yükselt",
                    title: "Premium görünürlüğü aç",
                    subtitle: "AI eşleşmeleri, mentör alanları ve daha güçlü keşif kartları için üyeliğini yükselt."
                )

                HStack(spacing: 12) {
                    Button("Aylık Premium") {
                        Task { await viewModel.activatePremium(session: session, plan: "monthly") }
                    }
                    .foundrlyPrimaryButton()

                    Button("Yıllık Premium") {
                        Task { await viewModel.activatePremium(session: session, plan: "yearly") }
                    }
                    .foundrlySecondaryButton()
                }
            } else if !user.is_verified_talent {
                FoundrlySectionHeader(
                    eyebrow: "Rozet",
                    title: "Doğrulanmış yetenek başvurusu",
                    subtitle: "Premium hesabın açık. Şimdi profilini daha prestijli hale getirmek için başvurunu tamamla."
                )

                entryField("Başvuru ünvanı", text: $verificationTitle)
                entryField("Portfolyo URL", text: $verificationPortfolio)
                entryField("Kısa not", text: $verificationNote)

                Button("Başvuruyu Gönder") {
                    Task {
                        await viewModel.submitVerification(
                            session: session,
                            requestedTitle: verificationTitle,
                            portfolioURL: verificationPortfolio,
                            note: verificationNote
                        )
                    }
                }
                .foundrlyPrimaryButton()
            } else {
                FoundrlySectionHeader(
                    eyebrow: "Durum",
                    title: "Profilin premium seviyede",
                    subtitle: "Rozetin aktif, premium görünürlüğün açık ve topluluk içinde daha güçlü konumdasın."
                )
            }
        }
        .foundrlyCard()
    }

    private func spotlight(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased())
                .font(.caption.weight(.bold))
                .foregroundStyle(FoundrlyTheme.textMuted)
            Text(value)
                .font(.headline.bold())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private func labelRow(_ title: String, _ items: [String]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.headline)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(items, id: \.self) { item in
                        Text(item)
                            .font(.caption.bold())
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                            .clipShape(Capsule())
                    }
                }
            }
        }
    }

    private func entryField(_ placeholder: String, text: Binding<String>) -> some View {
        TextField(placeholder, text: text, axis: .vertical)
            .padding()
            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    private func initials(from fullName: String) -> String {
        fullName
            .split(separator: " ")
            .prefix(2)
            .map { String($0.prefix(1)) }
            .joined()
            .uppercased()
    }
}
