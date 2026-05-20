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
    private let events: [CommunityEvent] = [
        .init(title: "Pamukkale AI Hack Night", type: "Hackathon", date: "24 Mayıs", location: "Çevrim içi"),
        .init(title: "Founder Match Session", type: "Networking", date: "28 Mayıs", location: "İstanbul / Hibrit"),
        .init(title: "Üniversite Startup Yarışması", type: "Yarışma", date: "2 Haziran", location: "Denizli"),
    ]

    private let stories: [CommunityStory] = [
        .init(title: "Haftanın Öne Çıkan Ekibi", subtitle: "CampusMind ekibi üç günde MVP çıkardı.", metric: "5 kişilik ekip"),
        .init(title: "Topluluk Spotu", subtitle: "Bu hafta 12 yeni builder ilk projesine katıldı.", metric: "+12 yeni üye"),
        .init(title: "Kurucu Hikâyesi", subtitle: "İki farklı şehirden kullanıcı Foundrly üzerinden ortak oldu.", metric: "1 yeni startup"),
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 18) {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Topluluk ve Etkinlikler")
                            .font(.system(size: 28, weight: .black, design: .rounded))
                        Text("Hackathonlar, networking oturumları ve haftalık topluluk hikâyeleri ile Foundrly'yi yaşayan bir ekosistem gibi takip et.")
                            .foregroundStyle(FoundrlyTheme.textSecondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Yaklaşan Etkinlikler")
                            .font(.title2.bold())

                        ForEach(events) { event in
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Text(event.type.uppercased())
                                        .font(.caption.bold())
                                        .padding(.horizontal, 10)
                                        .padding(.vertical, 6)
                                        .background(FoundrlyTheme.primary.opacity(0.18))
                                        .clipShape(Capsule())
                                    Spacer()
                                    Text(event.date)
                                        .font(.caption.bold())
                                        .foregroundStyle(FoundrlyTheme.accent)
                                }

                                Text(event.title)
                                    .font(.headline)
                                Text(event.location)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)

                                Button("Yerini Ayırt") {}
                                    .font(.footnote.bold())
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 10)
                                    .background(FoundrlyTheme.surfaceRaised)
                                    .clipShape(Capsule())
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()

                    VStack(alignment: .leading, spacing: 12) {
                        Text("Topluluk Anları")
                            .font(.title2.bold())

                        ForEach(stories) { story in
                            VStack(alignment: .leading, spacing: 8) {
                                Text(story.title)
                                    .font(.headline)
                                Text(story.subtitle)
                                    .foregroundStyle(FoundrlyTheme.textSecondary)
                                Text(story.metric)
                                    .font(.caption.bold())
                                    .foregroundStyle(FoundrlyTheme.accent)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()
                            .background(FoundrlyTheme.surfaceRaised)
                            .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .foundrlyCard()
                }
                .padding(20)
            }
            .background(FoundrlyTheme.background.ignoresSafeArea())
            .navigationTitle("Topluluk")
        }
    }
}
