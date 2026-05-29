import SwiftUI

private struct CommunityEvent: Identifiable {
    let id = UUID()
    let title: String
    let type: String
    let date: String
    let location: String
}

private struct CommunityStory: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let metric: String
}

struct CommunityView: View {
    @EnvironmentObject private var session: AppSession
    @ObservedObject var viewModel: AppShellViewModel
    @State private var searchText = ""
    @State private var verifiedOnly = false

    private let events: [CommunityEvent] = [
        .init(title: "Pamukkale AI Hack Night", type: "Hackathon", date: "24 Mayıs", location: "Çevrim içi"),
        .init(title: "Founder Match Session", type: "Networking", date: "28 Mayıs", location: "İstanbul / Hibrit"),
        .init(title: "Üniversite Startup Yarışması", type: "Yarışma", date: "2 Haziran", location: "Denizli")
    ]

    private let stories: [CommunityStory] = [
        .init(title: "Haftanın Öne Çıkan Ekibi", subtitle: "CampusMind ekibi üç günde MVP çıkardı.", metric: "5 kişilik ekip"),
        .init(title: "Topluluk Spotu", subtitle: "Bu hafta 12 yeni builder ilk projesine katıldı.", metric: "+12 yeni üye"),
        .init(title: "Kurucu Hikâyesi", subtitle: "İki farklı şehirden kullanıcı Foundrly üzerinden ortak oldu.", metric: "1 yeni startup")
    ]

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 18) {
                    FoundrlySectionHeader(
                        eyebrow: "Topluluk",
                        title: "Topluluk ve ağ kurma merkezi",
                        subtitle: "Web’de dağınık kalan topluluk, networking ve etkinlik mantığını mobilde tek bir premium merkezde topladım."
                    )
                    .foundrlyCard()

                    networkingPanel
                    incomingFriendRequests
                    eventPanel

                    VStack(alignment: .leading, spacing: 14) {
                        Text("Topluluk Hikâyeleri")
                            .font(.title2.bold())

                        ForEach(stories) { story in
                            VStack(alignment: .leading, spacing: 10) {
                                Text(story.title)
                                    .font(.headline.bold())
                                Text(story.subtitle)
                                    .font(.subheadline)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                Text(story.metric)
                                    .font(.caption.bold())
                                    .foregroundStyle(FoundrlyTheme.accent)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .foundrlySoftCard()
                        }
                    }
                    .foundrlyCard()
                }
                .padding(20)
                .padding(.bottom, 40)
            }
            .foundrlyScreen()
            .navigationTitle("Topluluk")
            .task {
                if viewModel.communityMembers.isEmpty {
                    await viewModel.loadCommunityMembers(session: session)
                }
            }
        }
    }

    private var incomingPendingRequests: [FriendRequestSummary] {
        let currentUserId = session.currentUser?.id
        return viewModel.friendRequests.filter { $0.status == "pending" && $0.receiver == currentUserId }
    }

    private var networkingPanel: some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "Networking",
                title: "Kurucular, geliştiriciler ve üreticiler",
                subtitle: "Mobilde de topluluk keşfi yap, üye profiline geç ve bağlantı ağını büyüt."
            )

            if session.currentUser?.is_premium == true {
                TextField("İsim veya ünvan ara", text: $searchText)
                    .padding()
                    .background(FoundrlyTheme.surfaceSoft.opacity(0.92))
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))

                Toggle("Sadece doğrulanmış profilleri göster", isOn: $verifiedOnly)
                    .toggleStyle(.switch)
                    .tint(FoundrlyTheme.primaryBright)

                Button("Topluluğu Yenile") {
                    Task {
                        await viewModel.loadCommunityMembers(session: session, search: searchText, verifiedOnly: verifiedOnly)
                    }
                }
                .foundrlyPrimaryButton()

                ForEach(viewModel.communityMembers.prefix(8)) { member in
                    NavigationLink {
                        PublicProfileView(viewModel: viewModel, userId: member.id)
                    } label: {
                        VStack(alignment: .leading, spacing: 10) {
                            HStack(alignment: .top) {
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(member.full_name)
                                        .font(.headline.bold())
                                        .foregroundStyle(.white)
                                    Text(member.title)
                                        .font(.subheadline)
                                        .foregroundStyle(FoundrlyTheme.textSecondary)
                                }
                                Spacer()
                                if member.is_verified_talent {
                                    FoundrlyPill(
                                        title: "Doğrulanmış",
                                        tint: FoundrlyTheme.accent.opacity(0.18),
                                        textColor: FoundrlyTheme.accent
                                    )
                                }
                            }

                            if let bio = member.bio, !bio.isEmpty {
                                Text(bio)
                                    .font(.subheadline)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                    .lineLimit(3)
                            }

                            if let skills = member.skills, !skills.isEmpty {
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 8) {
                                        ForEach(skills.prefix(4), id: \.self) { skill in
                                            Text(skill)
                                                .font(.caption.bold())
                                                .padding(.horizontal, 12)
                                                .padding(.vertical, 8)
                                                .background(FoundrlyTheme.surface.opacity(0.72))
                                                .clipShape(Capsule())
                                        }
                                    }
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .foundrlySoftCard()
                    }
                }
            } else {
                Text("Topluluk araması ve doğrulanmış profil filtreleri premium üyelerde açılır.")
                    .foregroundStyle(FoundrlyTheme.textSecondary)

                HStack(alignment: .top, spacing: 12) {
                    lockedCard("Üye arama", "Kurucu, geliştirici ve tasarımcıları daha dar filtrelerle keşfet.")
                    lockedCard("Doğrulanmış filtre", "Yüksek sinyalli üyeleri hızlıca öne çıkar.")
                }
            }
        }
        .foundrlyCard()
    }

    private var incomingFriendRequests: some View {
        VStack(alignment: .leading, spacing: 14) {
            FoundrlySectionHeader(
                eyebrow: "İstek Kutusu",
                title: "Topluluk bağlantı kararları",
                subtitle: "Sana gelen ağ kurma istekleri burada toplanır."
            )

            if incomingPendingRequests.isEmpty {
                Text("Şu an bekleyen ağ isteği görünmüyor.")
                    .foregroundStyle(FoundrlyTheme.textSecondary)
            } else {
                ForEach(incomingPendingRequests) { request in
                    VStack(alignment: .leading, spacing: 10) {
                        Text(request.sender_name)
                            .font(.headline.bold())
                        Text("Seninle bağlantı kurmak istiyor.")
                            .font(.subheadline)
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                        HStack(spacing: 12) {
                            Button("Kabul Et") {
                                Task {
                                    await viewModel.updateFriendRequest(session: session, requestId: request.id, status: "accepted")
                                }
                            }
                            .foundrlyPrimaryButton()

                            Button("Reddet") {
                                Task {
                                    await viewModel.updateFriendRequest(session: session, requestId: request.id, status: "rejected")
                                }
                            }
                            .foundrlySecondaryButton()
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlySoftCard()
                }
            }
        }
        .foundrlyCard()
    }

    private var eventPanel: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Yaklaşan Etkinlikler")
                .font(.title2.bold())

            ForEach(events) { event in
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        FoundrlyPill(title: event.type.uppercased(), tint: FoundrlyTheme.primary.opacity(0.2))
                        Spacer()
                        Text(event.date)
                            .font(.caption.bold())
                            .foregroundStyle(FoundrlyTheme.gold)
                    }

                    Text(event.title)
                        .font(.headline.bold())
                    Text(event.location)
                        .font(.subheadline)
                        .foregroundStyle(FoundrlyTheme.textSecondary)

                    Button("Yerini Ayırt") {}
                        .foundrlySecondaryButton()
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .foundrlySoftCard()
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
}
