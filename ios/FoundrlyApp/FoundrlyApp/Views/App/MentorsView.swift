import SwiftUI

struct MentorsView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var selectedMentor: MentorSummary?
    @State private var requestMessage = ""
    @State private var offerDrafts: [Int: String] = [:]

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 18) {
                    if session.currentUser?.is_mentor == true {
                        mentorPanel
                    } else {
                        mentorsMarketplace
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
                .padding(.bottom, 40)
            }
            .foundrlyScreen()
            .navigationTitle("Mentörler")
        }
    }

    private var mentorsMarketplace: some View {
        VStack(alignment: .leading, spacing: 16) {
            FoundrlySectionHeader(
                eyebrow: "Mentör Ağı",
                title: "Üst düzey uzmanlarla ilerle",
                subtitle: "Kilitli alanları da premium bir ürün yüzeyi gibi yeniden düzenledim; metin çakışması yerine daha net değer anlatıyor."
            )

            if session.currentUser?.is_premium != true {
                HStack(alignment: .top, spacing: 12) {
                    lockedCard("1:1 görüşme", "Premium ile deneyimli mentörlerden doğrudan yön al.")
                    lockedCard("Öncelikli talep", "Daha görünür talep kartı ve hızlı dönüş akışı.")
                }

                Button("Premium'u Aç") {
                    Task { await viewModel.activatePremium(session: session, plan: "monthly") }
                }
                .foundrlyPrimaryButton()
            } else if let selectedMentor {
                mentorDetail(selectedMentor)
            } else {
                ForEach(viewModel.mentors) { mentor in
                    Button {
                        selectedMentor = mentor
                    } label: {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(alignment: .top) {
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(mentor.full_name)
                                        .font(.headline.bold())
                                        .foregroundStyle(.white)
                                    Text(mentor.title)
                                        .font(.subheadline)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                }
                                Spacer()
                                FoundrlyPill(
                                    title: mentor.mentor_price == 0 ? "Ücretsiz" : "$\(Int(mentor.mentor_price))",
                                    tint: FoundrlyTheme.accent.opacity(0.18),
                                    textColor: FoundrlyTheme.accent
                                )
                            }

                            Text(mentor.bio)
                                .font(.subheadline)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .lineLimit(3)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(mentor.skills, id: \.self) { skill in
                                        Text(skill)
                                            .font(.caption.bold())
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 8)
                                            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlySoftCard()
                    }
                }
            }
        }
        .foundrlyCard()
    }

    private func mentorDetail(_ mentor: MentorSummary) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            Button("← Mentör listesine dön") {
                selectedMentor = nil
                requestMessage = ""
            }
            .font(.footnote.bold())
            .foregroundStyle(FoundrlyTheme.accent)

            Text(mentor.full_name)
                .font(.title2.bold())
            Text(mentor.title)
                .foregroundStyle(FoundrlyTheme.textSecondary)
            Text(mentor.bio)
                .foregroundStyle(FoundrlyTheme.textSecondary)

            TextField("Projeni ve beklentini kısaca anlat", text: $requestMessage, axis: .vertical)
                .padding()
                .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            Button("Mentörlük Talebi Gönder") {
                guard !requestMessage.isEmpty else { return }
                Task {
                    await viewModel.requestMentor(session: session, mentorId: mentor.id, message: requestMessage)
                    requestMessage = ""
                    selectedMentor = nil
                }
            }
            .foundrlyPrimaryButton()
        }
        .foundrlySoftCard()
    }

    private var mentorPanel: some View {
        VStack(alignment: .leading, spacing: 16) {
            FoundrlySectionHeader(
                eyebrow: "Mentör Paneli",
                title: "Taleplerini profesyonel biçimde yönet",
                subtitle: "Gelir, teklif ve bekleyen kullanıcı akışını daha derli toplu bir panelde topladım."
            )

            if let user = session.currentUser {
                HStack(spacing: 12) {
                    statPill("Bakiye", "$\(Int(user.mentor_balance ?? 0))")
                    statPill("Kredi", "\(user.mentor_credits ?? 0)")
                    statPill("Ücret", "$\(Int(user.mentor_price ?? 0))")
                }
            }

            if viewModel.mentorRequests.isEmpty {
                Text("Henüz mentörlük talebi yok.")
                    .foregroundStyle(FoundrlyTheme.textSecondary)
                    .foundrlySoftCard()
            } else {
                ForEach(viewModel.mentorRequests) { request in
                    VStack(alignment: .leading, spacing: 12) {
                        Text(request.user_details?.full_name ?? "Kullanıcı")
                            .font(.headline.bold())
                        Text(request.message)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        FoundrlyPill(title: request.status.uppercased(), tint: FoundrlyTheme.primary.opacity(0.22))

                        if request.status == "pending" {
                            TextField("Teklif ücreti", text: Binding(
                                get: { offerDrafts[request.id] ?? (request.offered_price > 0 ? String(Int(request.offered_price)) : "") },
                                set: { offerDrafts[request.id] = $0 }
                            ))
                            .keyboardType(.numberPad)
                            .padding()
                            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                            HStack(spacing: 12) {
                                Button("Onayla") {
                                    let price = Double(offerDrafts[request.id] ?? "") ?? request.offered_price
                                    Task {
                                        await viewModel.updateMentorRequest(
                                            session: session,
                                            requestId: request.id,
                                            status: "accepted",
                                            offeredPrice: price
                                        )
                                    }
                                }
                                .foundrlyPrimaryButton()

                                Button("Tamamlandı") {
                                    Task {
                                        await viewModel.updateMentorRequest(
                                            session: session,
                                            requestId: request.id,
                                            status: "completed"
                                        )
                                    }
                                }
                                .foundrlySecondaryButton()
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlySoftCard()
                }
            }
        }
        .foundrlyCard()
    }

    private func lockedCard(_ title: String, _ body: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Image(systemName: "lock.shield.fill")
                .font(.title3)
                .foregroundStyle(FoundrlyTheme.gold)
            Text(title)
                .font(.headline.bold())
            Text(body)
                .font(.subheadline)
                .foregroundStyle(FoundrlyTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, minHeight: 150, alignment: .leading)
        .padding(16)
        .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
    }

    private func statPill(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased())
                .font(.caption.bold())
                .foregroundStyle(FoundrlyTheme.textMuted)
            Text(value)
                .font(.headline.bold())
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}
