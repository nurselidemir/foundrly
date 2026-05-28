import SwiftUI

struct MentorsView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var selectedMentor: MentorSummary?
    @State private var requestMessage = ""
    @State private var offerDrafts: [Int: String] = [:]

    var body: some View {
        NavigationStack {
            ScrollView {
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
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .navigationTitle("Mentörler")
        }
    }

    private var mentorsMarketplace: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Mentör Desteği")
                .font(.title2.bold())

            if session.currentUser?.is_premium != true {
                Text("Mentör desteği premium kullanıcılar için açık. Önce premium üyeliğini aktive et.")
                    .foregroundStyle(FoundrlyTheme.textSecondary)
                Button("Premium'u Aç") {
                    Task { await viewModel.activatePremium(session: session, plan: "monthly") }
                }
                .fontWeight(.bold)
                .frame(maxWidth: .infinity)
                .padding()
                .background(FoundrlyTheme.primary)
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
            } else if let selectedMentor {
                VStack(alignment: .leading, spacing: 12) {
                    Button("← Mentör listesine dön") {
                        self.selectedMentor = nil
                        requestMessage = ""
                    }
                    .font(.footnote.bold())
                    .foregroundStyle(FoundrlyTheme.primary)

                    Text(selectedMentor.full_name)
                        .font(.title3.bold())
                    Text(selectedMentor.title)
                        .foregroundStyle(FoundrlyTheme.textSecondary)
                    Text(selectedMentor.bio)
                        .foregroundStyle(FoundrlyTheme.textSecondary)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(selectedMentor.skills, id: \.self) { skill in
                                Text(skill)
                                    .font(.caption.bold())
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(Capsule())
                            }
                        }
                    }

                    Text("Görüşme Ücreti: \(selectedMentor.mentor_price == 0 ? "Ücretsiz" : "$\(Int(selectedMentor.mentor_price))")")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(FoundrlyTheme.accent)

                    TextField("Projeni ve talebini kısaca anlat", text: $requestMessage, axis: .vertical)
                        .padding()
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                    Button("Mentörlük Talebi Gönder") {
                        guard !requestMessage.isEmpty else { return }
                        Task {
                            await viewModel.requestMentor(session: session, mentorId: selectedMentor.id, message: requestMessage)
                            requestMessage = ""
                            self.selectedMentor = nil
                        }
                    }
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(FoundrlyTheme.primary)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                }
            } else {
                ForEach(viewModel.mentors) { mentor in
                    Button {
                        selectedMentor = mentor
                    } label: {
                        VStack(alignment: .leading, spacing: 10) {
                            Text(mentor.full_name)
                                .font(.headline)
                                .foregroundStyle(.white)
                            Text(mentor.title)
                                .font(.subheadline)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                            Text(mentor.bio)
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                                .lineLimit(3)
                            Text(mentor.mentor_price == 0 ? "Ücretsiz Görüşme" : "$\(Int(mentor.mentor_price)) / görüşme")
                                .font(.caption.bold())
                                .foregroundStyle(FoundrlyTheme.accent)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                        .background(FoundrlyTheme.surfaceRaised)
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }

    private var mentorPanel: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Mentör Paneli")
                .font(.title2.bold())

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
            } else {
                ForEach(viewModel.mentorRequests) { request in
                    VStack(alignment: .leading, spacing: 10) {
                        Text(request.user_details?.full_name ?? "Kullanıcı")
                            .font(.headline)
                        Text(request.message)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        Text("Durum: \(request.status)")
                            .font(.caption.bold())
                            .foregroundStyle(FoundrlyTheme.accent)

                        if request.status == "pending" {
                            TextField("Teklif ücreti", text: Binding(
                                get: { offerDrafts[request.id] ?? (request.offered_price > 0 ? String(Int(request.offered_price)) : "") },
                                set: { offerDrafts[request.id] = $0 }
                            ))
                            .keyboardType(.numberPad)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))

                            HStack {
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
                                .fontWeight(.bold)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(FoundrlyTheme.accent)
                                .foregroundStyle(.black)
                                .clipShape(Capsule())

                                Button("Tamamlandı") {
                                    Task {
                                        await viewModel.updateMentorRequest(
                                            session: session,
                                            requestId: request.id,
                                            status: "completed"
                                        )
                                    }
                                }
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(Capsule())
                            }
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(FoundrlyTheme.surfaceRaised)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }

    private func statPill(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.caption.bold())
                .foregroundStyle(FoundrlyTheme.textSecondary)
            Text(value)
                .font(.headline.bold())
                .foregroundStyle(.white)
        }
        .padding()
        .background(FoundrlyTheme.surfaceRaised)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}
