import SwiftUI

struct PublicProfileView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    let userId: Int

    @State private var selectedApplicationId = ""
    @State private var communicationRating = 5
    @State private var teamworkRating = 5
    @State private var reliabilityRating = 5
    @State private var technicalRating = 5
    @State private var reviewComment = ""

    var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                if let profile = viewModel.selectedPublicProfile, profile.id == userId {
                    VStack(alignment: .leading, spacing: 10) {
                        Text(profile.full_name)
                            .font(.system(size: 30, weight: .black, design: .rounded))
                        Text(profile.title)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        Text(profile.bio)
                            .foregroundStyle(FoundrlyTheme.textSecondary)

                        HStack(spacing: 8) {
                            badge(profile.is_premium ? "Premium" : "Topluluk Üyesi", tint: profile.is_premium ? FoundrlyTheme.primary : .white.opacity(0.14))
                            badge(profile.is_verified_talent ? "Doğrulanmış" : "Doğrulanmamış", tint: profile.is_verified_talent ? FoundrlyTheme.accent : .white.opacity(0.14))
                        }

                        if let threadId = profile.active_application_id, let meId = session.currentUser?.id, meId != profile.id {
                            Button {
                                Task {
                                    await viewModel.selectThread(session: session, applicationId: threadId)
                                    viewModel.selectedTabTag = session.isAdmin ? 2 : (session.isMentor ? 2 : 3)
                                }
                            } label: {
                                HStack(spacing: 8) {
                                    Image(systemName: "message.fill")
                                    Text("Mesaj Gönder / Sohbet Başlat")
                                        .fontWeight(.bold)
                                }
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(FoundrlyTheme.primary)
                                .foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                            }
                            .padding(.top, 5)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Yetenekler")
                            .font(.headline)
                        chipRow(profile.skills)
                        Text("İlgi Alanları")
                            .font(.headline)
                        chipRow(profile.interests)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()

                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Yorumlar")
                                .font(.headline)
                            Spacer()
                            Text(profile.average_rating.map { String(format: "%.1f / 5", $0) } ?? "Henüz puan yok")
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        }

                        if profile.reviews.isEmpty {
                            Text("Bu kullanıcı için henüz yorum bulunmuyor.")
                                .foregroundStyle(FoundrlyTheme.textSecondary)
                        } else {
                            ForEach(profile.reviews) { review in
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(review.reviewer.full_name)
                                        .font(.subheadline.bold())
                                    Text(String(repeating: "★", count: review.rating))
                                        .foregroundStyle(FoundrlyTheme.accent)
                                    Text(review.comment)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                    Text(review.project.title)
                                        .font(.caption)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
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

                    if !profile.eligible_review_applications.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Birlikte Çalışma Yorumu Bırak")
                                .font(.headline)

                            Picker("Proje", selection: $selectedApplicationId) {
                                ForEach(profile.eligible_review_applications) { item in
                                    Text(item.project_title).tag(String(item.application_id))
                                }
                            }
                            .pickerStyle(.menu)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                            VStack(alignment: .leading, spacing: 10) {
                                Text("Değerlendirme Kriterleri")
                                    .font(.subheadline.bold())
                                    .foregroundStyle(FoundrlyTheme.textSecondary)

                                Stepper("İletişim: \(communicationRating) Puan", value: $communicationRating, in: 1...5)
                                    .padding(.horizontal)
                                    .padding(.vertical, 8)
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                                Stepper("Takım Çalışması: \(teamworkRating) Puan", value: $teamworkRating, in: 1...5)
                                    .padding(.horizontal)
                                    .padding(.vertical, 8)
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                                Stepper("Güvenilirlik: \(reliabilityRating) Puan", value: $reliabilityRating, in: 1...5)
                                    .padding(.horizontal)
                                    .padding(.vertical, 8)
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))

                                Stepper("Teknik Yetkinlik: \(technicalRating) Puan", value: $technicalRating, in: 1...5)
                                    .padding(.horizontal)
                                    .padding(.vertical, 8)
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                                
                                Text("* Genel puan, kriterlerin ortalaması alınarak hesaplanır.")
                                    .font(.caption)
                                    .italic()
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                            }

                            TextField("Yorumun", text: $reviewComment, axis: .vertical)
                                .padding()
                                .background(FoundrlyTheme.surfaceRaised)
                                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                            Button("Yorumu Gönder") {
                                guard let applicationId = Int(selectedApplicationId), !reviewComment.isEmpty else { return }
                                let averageRating = Int(round(Double(communicationRating + teamworkRating + reliabilityRating + technicalRating) / 4.0))
                                Task {
                                    await viewModel.submitReview(
                                        session: session,
                                        userId: userId,
                                        applicationId: applicationId,
                                        rating: averageRating,
                                        comment: reviewComment
                                    )
                                    reviewComment = ""
                                }
                            }
                            .fontWeight(.bold)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(FoundrlyTheme.primary)
                            .foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                        }
                        .onAppear {
                            if selectedApplicationId.isEmpty {
                                selectedApplicationId = String(profile.eligible_review_applications.first?.application_id ?? 0)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlyCard()
                    }
                } else {
                    ProgressView()
                        .tint(.white)
                        .padding(.top, 40)
                }
            }
            .padding(20)
        }
        .background(FoundrlyTheme.background.ignoresSafeArea())
        .navigationTitle("Üye Profili")
        .task {
            await viewModel.loadPublicProfile(session: session, userId: userId)
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

    private func chipRow(_ items: [String]) -> some View {
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
