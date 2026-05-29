import SwiftUI

struct PublicProfileView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    let userId: Int

    @State private var selectedApplicationId = ""
    @State private var rating = 5
    @State private var reviewComment = ""

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 18) {
                if let profile = viewModel.selectedPublicProfile, profile.id == userId {
                    hero(profile)
                    relationshipPanel(profile)
                    expertise(profile)
                    recentProjects(profile)
                    reviews(profile)

                    if !profile.eligible_review_applications.isEmpty {
                        reviewComposer(profile)
                    }
                } else {
                    ProgressView()
                        .tint(.white)
                        .padding(.top, 40)
                }
            }
            .padding(20)
            .padding(.bottom, 40)
        }
        .foundrlyScreen()
        .navigationTitle("Üye Profili")
        .task {
            await viewModel.loadPublicProfile(session: session, userId: userId)
        }
    }

    private var relationshipStatus: String {
        guard let currentUserId = session.currentUser?.id else { return "none" }
        if currentUserId == userId { return "self" }

        if let request = viewModel.friendRequests.first(where: {
            (($0.sender == currentUserId && $0.receiver == userId) || ($0.sender == userId && $0.receiver == currentUserId))
        }) {
            return request.status
        }

        return "none"
    }

    private func hero(_ profile: PublicProfile) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(profile.full_name)
                .font(.system(size: 30, weight: .black, design: .rounded))
            Text(profile.title)
                .foregroundStyle(FoundrlyTheme.textSecondary)
            Text(profile.bio)
                .foregroundStyle(FoundrlyTheme.textSecondary)

            HStack(spacing: 8) {
                FoundrlyPill(
                    title: profile.is_premium ? "Premium" : "Topluluk Üyesi",
                    tint: profile.is_premium ? FoundrlyTheme.gold.opacity(0.22) : FoundrlyTheme.surfaceSoft,
                    textColor: profile.is_premium ? FoundrlyTheme.gold : .white
                )
                FoundrlyPill(
                    title: profile.is_verified_talent ? "Doğrulanmış" : "Doğrulanmamış",
                    tint: profile.is_verified_talent ? FoundrlyTheme.accent.opacity(0.18) : FoundrlyTheme.surfaceSoft,
                    textColor: profile.is_verified_talent ? FoundrlyTheme.accent : .white
                )
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }

    private func relationshipPanel(_ profile: PublicProfile) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            FoundrlySectionHeader(
                eyebrow: "Bağlantı",
                title: "Topluluk erişimini genişlet",
                subtitle: "Web’deki ağ kurma aksiyonunu mobil üye profiline de taşıdım."
            )

            switch relationshipStatus {
            case "self":
                Text("Bu senin herkese açık profil görünümün.")
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            case "accepted":
                FoundrlyPill(title: "Bağlantı kuruldu", tint: FoundrlyTheme.accent.opacity(0.18), textColor: FoundrlyTheme.accent)
            case "pending":
                FoundrlyPill(title: "İstek beklemede", tint: FoundrlyTheme.gold.opacity(0.18), textColor: FoundrlyTheme.gold)
            case "rejected":
                Text("Bu kullanıcıyla daha önce tamamlanmamış bir ağ isteği bulunuyor.")
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            default:
                Button("Ağ Kurma İsteği Gönder") {
                    Task {
                        await viewModel.sendFriendRequest(session: session, receiverId: profile.id)
                    }
                }
                .foundrlyPrimaryButton()
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }

    private func expertise(_ profile: PublicProfile) -> some View {
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
    }

    private func reviews(_ profile: PublicProfile) -> some View {
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
                    VStack(alignment: .leading, spacing: 8) {
                        Text(review.reviewer.full_name)
                            .font(.subheadline.bold())
                        Text(String(repeating: "★", count: review.rating))
                            .foregroundStyle(FoundrlyTheme.gold)
                        Text(review.comment)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        Text(review.project.title)
                            .font(.caption)
                            .foregroundStyle(FoundrlyTheme.textMuted)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlySoftCard()
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }

    private func recentProjects(_ profile: PublicProfile) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Son Projeler")
                    .font(.headline)
                Spacer()
                Text("\(profile.recent_projects.count) proje")
                    .font(.caption.bold())
                    .foregroundStyle(FoundrlyTheme.textMuted)
            }

            if profile.recent_projects.isEmpty {
                Text("Henüz herkese açık proje paylaşımı görünmüyor.")
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            } else {
                ForEach(profile.recent_projects) { project in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(project.title)
                            .font(.headline.bold())
                        Text(project.summary)
                            .font(.subheadline)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                            .lineLimit(3)
                        Text(String(project.created_at.prefix(10)))
                            .font(.caption)
                            .foregroundStyle(FoundrlyTheme.textMuted)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlySoftCard()
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }

    private func reviewComposer(_ profile: PublicProfile) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            FoundrlySectionHeader(
                eyebrow: "Geri Bildirim",
                title: "Birlikte çalışma yorumu bırak",
                subtitle: "Tamamlanan iş birliklerinden sonra üyelerin güven sinyalini mobilde de güçlendir."
            )

            Picker("Proje", selection: $selectedApplicationId) {
                ForEach(profile.eligible_review_applications) { item in
                    Text(item.project_title).tag(String(item.application_id))
                }
            }
            .pickerStyle(.menu)
            .padding()
            .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            Stepper("Puan: \(rating)", value: $rating, in: 1...5)
                .padding()
                .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            TextField("Yorumun", text: $reviewComment, axis: .vertical)
                .padding()
                .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

            Button("Yorumu Gönder") {
                guard let applicationId = Int(selectedApplicationId), !reviewComment.isEmpty else { return }
                Task {
                    await viewModel.submitReview(
                        session: session,
                        userId: userId,
                        applicationId: applicationId,
                        rating: rating,
                        comment: reviewComment
                    )
                    reviewComment = ""
                }
            }
            .foundrlyPrimaryButton()
        }
        .onAppear {
            if selectedApplicationId.isEmpty {
                selectedApplicationId = String(profile.eligible_review_applications.first?.application_id ?? 0)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .foundrlyCard()
    }

    private func chipRow(_ items: [String]) -> some View {
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
