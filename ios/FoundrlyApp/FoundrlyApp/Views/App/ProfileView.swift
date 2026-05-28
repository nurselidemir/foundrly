import SwiftUI

struct ProfileView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var verificationTitle = ""
    @State private var verificationPortfolio = ""
    @State private var verificationNote = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    if let user = session.currentUser {
                        VStack(alignment: .leading, spacing: 10) {
                            Text(user.full_name)
                                .font(.system(size: 30, weight: .black, design: .rounded))
                            Text(user.title)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text(user.bio)
                                .foregroundStyle(FoundrlyTheme.textSecondary)

                            HStack(spacing: 8) {
                                badge(user.is_premium ? "Premium" : "Standart", tint: user.is_premium ? FoundrlyTheme.primary : .white.opacity(0.16))
                                badge(user.is_verified_talent ? "Doğrulanmış" : "Rozet Yok", tint: user.is_verified_talent ? FoundrlyTheme.accent : .white.opacity(0.16))
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()

                        VStack(alignment: .leading, spacing: 12) {
                            Text("Yetenekler")
                                .font(.headline)
                            skillWrap(user.skills)
                            Text("İlgi Alanları")
                                .font(.headline)
                            skillWrap(user.interests)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()

                        if !user.is_premium {
                            VStack(alignment: .leading, spacing: 10) {
                                Text("Premium'a Yükselt")
                                    .font(.headline)
                                Text("AI ekip eşleşmeleri, verified talent başvurusu ve daha yüksek görünürlük için premiumu aktive et.")
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                HStack(spacing: 12) {
                                    Button("Aylık Premium") {
                                        Task { await viewModel.activatePremium(session: session, plan: "monthly") }
                                    }
                                    .premiumButtonStyle()

                                    Button("Yıllık Premium") {
                                        Task { await viewModel.activatePremium(session: session, plan: "yearly") }
                                    }
                                    .premiumButtonStyle()
                                }
                            }
                            .foundrlyCard()
                        } else if !user.is_verified_talent {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Doğrulanmış Yetenek Başvurusu")
                                    .font(.headline)
                                Text("Premium hesabın açık. Profiline rozet eklenmesi için başvurunu yönetim ekibine ilet.")
                                    .foregroundStyle(FoundrlyTheme.textSecondary)

                                Group {
                                    TextField("Başvuru ünvanı", text: $verificationTitle)
                                    TextField("Portfolyo URL", text: $verificationPortfolio)
                                    TextField("Kısa not", text: $verificationNote, axis: .vertical)
                                }
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

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
                                .premiumButtonStyle()
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
                        .background(.white.opacity(0.08))
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                    }
                }
                .padding(20)
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .navigationTitle("Profilim")
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
}

private extension View {
    func premiumButtonStyle() -> some View {
        self
            .fontWeight(.bold)
            .frame(maxWidth: .infinity)
            .padding()
            .background(FoundrlyTheme.primary)
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}
